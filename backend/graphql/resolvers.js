const { Message, Recipient, Conversation, User, Game, Application, Language, Ruleset, GameType, AboutMe } = require('../db/models');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { Op } = require('sequelize');
const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const user = require('../db/models/user');

const pubsub = new PubSub();

const rolldice = (number, sides) => {
//roll `number` `side`ed dice.
    const getRandomRoll = (sides) => {
        return Math.floor(Math.random() * (sides - 1) + 1);
    };
    const diceMultiplier = (accumulator, currentValue) => accumulator + currentValue;

    const diceArray = [];

    for (let i = 0; i <= number; i++) {
        diceArray.push(getRandomRoll(sides))
    }
    console.log(diceArray);
    return diceArray.reduce(diceMultiplier);

};

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        users: (obj, args, context, info) => {
            //This is where you actually query the database.
            return User.findAll({})
          },
        user:(obj, args, context, info) => {
            console.log(args);
            const {id} = args
            return User.findByPk(id);
        },
        games: (obj, args, context, info) => {
            return Game.findAll({
                include: [{model: User, as: "host"}]
            });

        },
        game: (obj, args, context, info) => {
            const id = args.id;
           return Game.findByPk(id, {include: [{model: User, as: "host"}, {model: Application, include: [{model: User, as: "applicant"}]}]});
            console.log(game)
        },
        messages: (obj, args, context, info) => {
            return Message.findAll();
        },

        convos: async (obj, args, context, info) => {
            return Message.findAndCountAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20, offset: args.offset});
        },
        about: (obj, args, context, info) => {
            const { id } = args;
            console.log(args)
            return AboutMe.findAll({where: {userId: id}, include: User})
        },
        //Get all non game conversations for a specific user
        getNonGameConvos: (obj, args, context, info) => {
            const { userId } = args;

            console.log('ID', userId)

            //find all individual conversations involving this user somehow

            //Conversations exist because some recipients may have multiple
            //private chats with the same people, and we want to keep
            //them separate.

            //finding convos where user is a recipient, then finding the other recipients of those convos.
            return User.findAll ({where: {id: userId}, include: {model: Conversation, as: "recipient", include: {model: User, as: "recipient"}}})

        },
        //TODO: GetSingleNonGameConversation
        getNonGameMessages: (obj, args, context, info) => {
            const { conversationId, offset } = args;
            return Message.findAndCountAll({where: {conversationId}, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit: 20, offset: offset,});
        },

        getGamesHosting: (obj, args, context, info) => {
            const { userId } = args;
            return Game.findAll({ where: { hostId: userId }, include: [{ model: Application }] })
        },

        //May have to rethink this one. It's messing up trying to use Application as a joins table.
        getApplication: async(obj, args, context, info) => {
            const { gameId, applicantId } = args;
            console.log('ARGS', args)
            //return Application.findAll({where: {userId: applicantId, gameId}, include: {model: User, as: "applicant"}});

            //NOTE:
            //I see now why I need a joins table. Application cannot function as a joins table itself. It needs to
            //hold just the app data. The userId etc needs to be on its own joins table.
            //otherwise, this gets messy.
            const apps = await User.findAll({where: {id: applicantId}, include: [{model: Game, as: "applicant", where: {userId: applicantId, gameId}}]})
            console.log(apps);
            //user findall where userid, include application where gameId
        },

        getPlayingWaitingGames: async (obj, args, context, info) => {
            const { userId } = args;
            const game = await Game.findAll({include: [{ model: User, as: "player", where: { id: userId }}, {model: User, as: "gameApplicant", where: { id: userId } }]});
            console.log(game);
        },

        checkWaitList: async (obj, args, context, info) => {
            const { id, userId } = args;

            //check if this user has applied to this game before. Must match both game _id and
            //userId in waitlist.
            const game = await Game.findAll({ where: {id}});
            return game;
        },

        getGameCreationInfo: async(obj, args, context, info) => {
            //We can return an object formatted however I want, as long as
            //our Typedefs are set up correctly!
            const languages = await Language.findAll();
            const rulesets = await Ruleset.findAll();
            const gameTypes = await GameType.findAll();
            return {languages, rulesets, gameTypes};
        }
    },
    Mutation: {
        sendMessageToGame: async(root,args) => {

        const { gameId, messageText, userId, offset } = args;

            //Check to see if this is a dice roll.
            //Fun with regex
            const numbers = messageText.match(/(\d+)[Dd](\d+)/);

            //console.log('NUMBERS', numbers)

            if (numbers !== null) {
                const result = rolldice(numbers[1], numbers[2]);

                //push roll results into messageText
                const messageText = `Dice roll result of ${numbers[1]}D${numbers[2]}: ${result}`;

                await Message.create({gameId, messageText, senderId: userId});

                const returnRoll = await Message.findAndCountAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

                pubsub.publish('NEW_MESSAGE', {messageSent: returnRoll});
            } else if (numbers === null) {
            const senderId = userId;
            await Message.create({gameId,messageText,senderId});

            const conversation = await Message.findAndCountAll({ where: { gameId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
        }
    },

    sendNonGameMessages: async(root,args) => {

        const { conversationId, messageText, userId, offset } = args;
        const senderId = userId;
            await Message.create({conversationId,messageText,senderId});

            const conversation = await Message.findAndCountAll({ where: { conversationId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});
            //console.log('CONVO', conversation.rows[0].conversationId)
            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            return conversation;

    },

    startNewNonGameConversation: async(root,args) => {

        const { currentUserId, recipientId, messageText } = args;

        console.log(args);

        //Create new Conversation, basically an empty container for tracking
        //distinct collections of messages
        const newConvo = await Conversation.create();
        const conversationId = newConvo.id

        //Add both recipients to list. Possibly rework this to add multiple
        //new recipients.
        await Recipient.create({userId: currentUserId, conversationId});
        await Recipient.create({userId: recipientId, conversationId});

        //Send back the new conversation so we can direct the user to it.
        return newConvo;

    },
        editMessage: async(root, args) => {
            const { messageId, editMessageText, userId } = args;
            console.log(args);
            await Message.update({ messageText: editMessageText }, { where: { id: messageId, senderId: userId }});

            //findAndCountAll seems weird, but our subscription expects something with rows and a count.
            const message = await Message.findAndCountAll({where: { id: messageId}, include: [{model: User, as: "sender"}], limit: 1 })
            pubsub.publish('NEW_MESSAGE', {messageSent: message});
        },

        deleteMessage: async(root, args) => {
            const { messageId, userId } = args;
            console.log(args);
            await Message.update({ deleted: true }, { where: { id: messageId, senderId: userId }});
            const message = await Message.findAndCountAll({where: { id: messageId}, include: [{model: User, as: "sender"}], limit: 1 });
            pubsub.publish('NEW_MESSAGE', {messageSent: message});
            return message;
        },

        submitGame: async(root, args) => {
                        const { userId, title, description, gameLanguageId, gameRulesetId, gameTypeId } = args;
                        const newGame = await Game.create({ hostId: userId, title, description, gameTypeId, ruleSetId: gameRulesetId, languageId: gameLanguageId}, {include: [{model:User, as: "host"}, {model:GameType}, {model:Language}]})
                        return newGame;
                    },
        changeEmail: async(root, args) => {
            const {userId, newEmail, changeEmailPassword} = args;
            const foundUser = await User.findByPk(userId);
            const passwordMatch = await bcrypt.compare(
                changeEmailPassword,
                foundUser.hashedPassword.toString()
              );
              if (passwordMatch) {
            foundUser.email = newEmail;
            await foundUser.save();
            return foundUser;
              } else {
                //Provide an Apollo error that the user cannot do this.
                throw new UserInputError('Please enter correct account password.');
              }
        },
        changePassword: async(root, args) => {
            const {userId, oldPassword, newPassword} = args;
            const user = await User.findByPk(userId);

            //Make sure the user has re-entered their old password correctly
            //and is therefore authorized to do this.
            const passwordMatch = await bcrypt.compare(
                oldPassword,
                user.hashedPassword.toString()
              );
              if (passwordMatch) {
                //Update user password with hashed version of new password
                //they provided
                await user.update({hashedPassword: bcrypt.hashSync(newPassword)});
                console.log("Update successful.")
              } else {
                //Provide an Apollo error that the user cannot do this.
                throw new UserInputError('Please enter correct account password.');

              }

              //How to send back a success response?
              //"Password successfully changed."
              //I guess if an error isn't thrown, we know.
              return user;
        },
        joinWaitlist: async(root, args) => {
            //If userId is hostId, do not allow.
            console.log(args);
            const { userId, gameId, whyJoin, charConcept, charName, experience } = args;
            const newApp = await Application.create({userId, gameId, whyJoin, charConcept, charName, experience});
            return newApp;
        }
    },
    Subscription: {
            messageSent: {
                //Filter so we only broadcast/update game or conversation this applies to
                subscribe: withFilter(() => pubsub.asyncIterator('NEW_MESSAGE'), (payload, variables) => {
                    console.log('VARS', variables)
                    //Structure is the same for both games and non-games; no need for a second subscription.
                    //We'll see if this is a game or conversation, first.
                    //If it has a gameId at all, it's a game.
                    if (variables.gameId !== null && variables.gameId !== undefined) {
                        //Yes, you have to cast it to a string...
                        return payload.messageSent.rows[0].gameId.toString() === variables.gameId;
                    }
                        console.log('PAYLOAD', payload, 'VARS', variables)
                        return payload.messageSent.rows[0].conversationId.toString() === variables.conversationId;
                }),
            },
        },
}


module.exports = resolvers;
