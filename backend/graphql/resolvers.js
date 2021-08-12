const { Message, Recipient, PlayerJoin, Conversation, Character, User, Game, Application, Language, Ruleset, GameType, AboutMe, Waitlist } = require('../db/models');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { Op } = require('sequelize');
const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const user = require('../db/models/user');

const pubsub = new PubSub();

const rolldice = (number, sides) => {
//roll `number` `side`ed dice.
    const getRandomRoll = (sides) => {
        return Math.floor((Math.random() * (sides - 1))  + 1);
    };

    const diceMultiplier = (accumulator, currentValue) => accumulator + currentValue;

    const diceArray = [];

    for (let i = 0; i < number; i++) {
        diceArray.push(getRandomRoll(sides))
    }

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

            const {id} = args
            return User.findByPk(id);
        },
        games: (obj, args, context, info) => {
            return Game.findAll({
                include: [{model: User, as: "host"}]
            });

        },
        rulesets: (obj, args, context, info) => {

            return Ruleset.findAll();
        },
        game:(obj, args, context, info) => {
           const {gameId} = args;
        //    return Game.findByPk(gameId, {include: [{model: User, as: "host"}, {model: User, as: "player"}, {model: Application, include: [{model: User, as: "applicationOwner"}]}]});
        return Game.findByPk(gameId, {include: [{model: User, as: "host"}, {model: Character, include: {model: User}}, {model: User, as: "player"}, {model: Application, include: [{model: User, as: "applicationOwner"}]}]});
    },
        character:(obj, args, context, info) => {
            const {userId, gameId} = args;
            return Character.findOne({where: {[Op.and]:
                [{userId}, {gameId}]}});
        },

        characterById: (obj, args, context, info) => {
            const { characterId } = args;
            return Character.findOne({where: { id: characterId }, include: [{ model: User }, { model: Game }]})
        },

        messages: (obj, args, context, info) => {
            return Message.findAll();
        },

        convos: async (obj, args, context, info) => {
            return Message.findAndCountAll({ where: {[Op.and]: [{ gameId: args.gameId, spectatorChat: false }]}, include: [
                {model: User, as: "sender",
                include: {model: Character, where: {
                    [Op.and]:
                         [
                         {userId: { [Op.col]: "sender.id"}},
                         {gameId: args.gameId}
                     ]
                    },
                    required: false

                }

                }

            ], order: [['createdAt', 'DESC']], limit:20, offset: args.offset});
        },
        spectatorConvos: async (obj, args, context, info) => {
            console.log('hit spectatorConvos')
            return Message.findAndCountAll({ where: {[Op.and]: [{ gameId: args.gameId, spectatorChat: true }]}, include: [
                {model: User, as: "sender",
                include: {model: Character, where: {
                    [Op.and]:
                         [
                         {userId: { [Op.col]: "sender.id"}},
                         {gameId: args.gameId}
                     ]
                    },
                    required: false

                }

                }

            ], order: [['createdAt', 'DESC']], limit:20, offset: args.offset});
        },
        about: (obj, args, context, info) => {
            const { id } = args;

            return AboutMe.findAll({where: {userId: id}, include: User})
        },
        //Get all non game conversations for a specific user
        getNonGameConvos: (obj, args, context, info) => {
            const { userId } = args;


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

        getApplication: async (obj, args, context, info) => {
            //Get all applications for this specific game associated with this specific user.
            const { gameId, applicationId } = args;
            const app = await Application.findAll({where: {id: applicationId}, include: [{model: User, through: "Waitlists", as: "applicationOwner"}, {model: Game, through: "Waitlists", include: { model: User, as: "host"}}]});

            return app;
            //return User.findAll({where: {id: applicantId}, include: {model: Game, through: "Waitlists", as: "applicant", where: { id: gameId }, include: {model: Application, through: "Waitlists", include: {model: User, as: "applicationOwner"}}}});
        },

        getPlayingWaitingGames: async (obj, args, context, info) => {
            //Get games where the user is a player, or on the waitlist.
            //Have to include application itself in order to get app status.
            const { userId } = args;
            return User.findAll({where: {id: userId}, include: [{model: Game, as: "player", include: {model: User, as: "host"}}, {model: Game, as: "applicant",  include: [{model: User, as: "host"}, {model: Application}]}]});
        },

        checkWaitList: async (obj, args, context, info) => {
            const { id, userId } = args;

            const game = await Game.findAll({ where: {id}});
            return game;
        },

        checkApplied: async (obj, args, context, info) => {
            const { gameId, userId } = args;

            //check if this user has applied to this game before. Must match both game _id and
            //userId in waitlist.
            //Users can apply multiple times, hence findAll.
            const list = await Waitlist.findAll({ where: {gameId, userId}});
            return list;

        },

        getWaitlistGames: async (obj, args, context, info) => {
            const { userId } = args;

            //does Application need gameId after all?
            //This is returning all games, not just games the user is in.
            const game = await Game.findAll({include: [{model: User, as: "host"},
            {model: User, through: "Waitlists", as: "applicant", where: { id: userId },
            include: { model: Application, through: "Waitlists", as: "applicationOwner" }}]})

            return game;
        },

        getGamesPlayingIn: (obj, args, context, info) => {
            const { userId } = args;

            return Game.findAll({include: [{model: User, as: "player", where: { id: userId }, include: {model: Character, where: { gameId: {[Op.col]: 'Game.id'}}, required: false}}, {model: User, as: "host"}] });
        },

        getGameCreationInfo: async(obj, args, context, info) => {
            //We can return an object formatted however I want, as long as
            //our Typedefs are set up correctly!
            const languages = await Language.findAll();
            const rulesets = await Ruleset.findAll();
            const gameTypes = await GameType.findAll();
            return {languages, rulesets, gameTypes};
        },

        simpleSearch: async(obj, args, context, info) => {
            const { text } = args;
            const words = text.split(' ');
            const wordsArray = [];

                    for (word in words) {
                        wordsArray.push(await Game.findAll({where: { title: {[Op.iLike]: '%' + words[word] + '%'} }}));
                    }

            return { wordsArray: wordsArray }

        },
    },
    Mutation: {
        sendMessageToGame: async(root,args) => {

            //TODO: add a spectatorChat flag of true or false
            //TODO: update migrations to flag if spectatorChat

        const { gameId, messageText, userId, offset, spectatorChat } = args;

            //Check to see if this is a dice roll.
            //Fun with regex
            const numbers = messageText.match(/(\d+)[Dd](\d+)/);

            if (numbers !== null) {
                const result = rolldice(numbers[1], numbers[2]);

                //push roll results into messageText
                const messageText = `Dice roll result of ${numbers[1]}D${numbers[2]}: ${result}`;

                await Message.create({gameId, messageText, senderId: userId,spectatorChat});

                const returnRoll = await Message.findAndCountAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

                pubsub.publish('NEW_MESSAGE', {messageSent: returnRoll});
            } else if (numbers === null) {
            const senderId = userId;
            await Message.create({gameId,messageText,senderId,spectatorChat});

            const conversation = await Message.findAndCountAll({ where: { gameId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

            if (spectatorChat === false) {
                pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            }
                pubsub.publish('NEW_SPECTATOR_MESSAGE', {spectatorMessageSent: conversation});
        }
    },

    sendNonGameMessages: async(root,args) => {

        const { conversationId, messageText, userId, offset } = args;
        const senderId = userId;
            await Message.create({conversationId,messageText,senderId});

            const conversation = await Message.findAndCountAll({ where: { conversationId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            return conversation;

    },

    startNewNonGameConversation: async(root,args) => {

        const { currentUserId, recipients, messageText } = args;

        console.log('RECIPIENTS', recipients)
        const arrayOfConversations = [];
        const arrayOfUsers = [];
        let newUser = false;

        if (recipients === undefined || recipients.length === 0) {
            throw new UserInputError("There must be at least one recipient.")
        }

        //This is silly, and I know it's silly.
        //But it works right now.
        //Refactor - maybe a findAll on Conversation where recipients include op.and recipients,
        //Then select on that's the correct length.

        const createNewConversation = async(recipients) => {
            //Create new Conversation, basically an empty container for tracking
            //distinct collections of messages
            const newConvo = await Conversation.create();
            const conversationId = newConvo.id

            //Add current user
            try {
                await Recipient.create({userId: currentUserId, conversationId})
            } catch(e) {
                console.log('Error', e)
            }

            //Add each recipient in recipients array
            recipients.forEach(async(recipient) => {
            //Op.iLike because we don't want to worry about case sensitivity
            try {
                let user = await User.findAll({where: { userName: {[Op.iLike]: recipient}
                }});
                await Recipient.create({userId: user[0].id, conversationId});
            } catch(e) {
                console.log('Error', e);
            }
        });

        //return the new conversation so we can grab the ID and redirect
        return newConvo;

        }

        //Check to see if we have a conversation with exactly all of these
        //recipients. If findByPk comes back undefined, we have a completely new
        //recipient without any prior conversations, and we can take a shortcut.

        //...maybe?
        //could make it buggy?
        const findSenderConversations = await Recipient.findAll({ where: { userId: currentUserId }});
        arrayOfConversations.push(...findSenderConversations);

        for await (let recipient of recipients) {
            console.log('recipient', recipient)
            let users = await User.findAll( { where: { userName: { [Op.iLike]: recipient } } });
            arrayOfUsers.push(...users);

            //If the user exists...
            if (users[0] !== undefined) {
                //Find all existing conversations with each user, push into array
            const findConversations = await Recipient.findAll({ where: { userId: users[0].id }});


            arrayOfConversations.push(...findConversations);
            } else {
                //Otherwise, throw error
                throw new UserInputError('A user with that user name does not exist.');
            }

        }


        //Edge case: no Recipient with this userId exists at all.
        //If that's the case, we know this IS a new conversation
        //We still need the rest of the recipients, though...
        if (arrayOfConversations.length === 0) {

            return await createNewConversation(recipients);
        } else {

            //DRY this up
            const arrayOfUserIds = arrayOfUsers.map(user => user.id.toString());

            //Find existing Conversations with each of these users
            const lookForAllRecipients = await Recipient.findAll({where: { userId: {[Op.or]: [...arrayOfUserIds, currentUserId]}}});

            //Now need to match up Recipients with conversationId somehow without making 50 database queries

            const conversationObjects = {};

            lookForAllRecipients.forEach((recipient) => {
                //If the conversation id associated with the recipient doesn't exist yet, set it.
                if (conversationObjects[recipient.conversationId.toString()] === undefined) {
                    const conversationId = recipient.conversationId.toString();
                    const recipientId = [recipient.userId.toString()];
                    //variable must be in square brackets in order to be evaluated
                    conversationObjects[conversationId] = recipientId;
                } else {
                    //If it does exist, add the new recipient value to that key.
                    conversationObjects[recipient.conversationId.toString()].push(recipient.userId.toString())
                }
            });


            const includeSender = [...arrayOfUserIds, currentUserId];

            const potentialDuplicates = [];

            //Next, find the conversation id where all recipients match
            for (let conversation in conversationObjects) {
                //Edge case - conversation exists with all recipients but includes more than
                //just those recipients
                //Solution - make sure the length is exactly the same as the length of recipients plus sender
                if (conversationObjects[conversation].every(value => includeSender.includes(value)) && conversationObjects[conversation].length === includeSender.length) {

                    //We know the conversation contains all recipients, but we want to make sure
                    //It doesn't contain MORE recipients
                    const potentialDuplication = await Conversation.findByPk(conversation, { include: { model: User, as: "recipient"}})
                    potentialDuplicates.push(potentialDuplication)
                }
            }

            //Figure out if a conversation is a duplicate by seeing if ANY of them are the same length
            const isDuplicate = potentialDuplicates.filter((conversation) => conversation.recipient.length === includeSender.length)

            if (isDuplicate.length === 0) {
                newUser = true;
            }
        //If we have new recipients...
        if (newUser === true) {
            return await createNewConversation(recipients);

        } else {

            //Get array of just the userIds for all recipients
            const arrayOfUserIds = arrayOfUsers.map(user => user.id.toString());

            //Find existing Conversations with each of these users
            const lookForAllRecipients = await Recipient.findAll({where: { userId: {[Op.or]: [...arrayOfUserIds, currentUserId]}}});

            //Now need to match up Recipients with conversationId somehow without making 50 database queries

            const conversationObjects = {};

            lookForAllRecipients.forEach((recipient) => {
                //If the conversation id associated with the recipient doesn't exist yet, set it.
                if (conversationObjects[recipient.conversationId.toString()] === undefined) {
                    const conversationId = recipient.conversationId.toString();
                    const recipientId = [recipient.userId.toString()];
                    //variable must be in square brackets in order to be evaluated
                    conversationObjects[conversationId] = recipientId;
                } else {
                    //If it does exist, add the new recipient value to that key.
                    conversationObjects[recipient.conversationId.toString()].push(recipient.userId.toString())
                }
            });

            let conversationLookingForId;
            const includeSender = [...arrayOfUserIds, currentUserId];

            //Next, find the conversation id where all recipients match
            for (let conversation in conversationObjects) {
                //Edge case - conversation exists with all recipients but includes more than
                //just those recipients
                //Solution - make sure the length is exactly the same as the length of recipients plus sender
                if (conversationObjects[conversation].every(value => includeSender.includes(value)) && conversationObjects[conversation].length === includeSender.length) {
                    conversationLookingForId = conversation;
                }
            }

            //Find the conversation and return it
            const conversationToReturn = await Conversation.findByPk(conversationLookingForId);
            // console.log('returned', conversationToReturn)
            return conversationToReturn;


        }

        }

    },

    addRecipient: async(root, args) => {
        const { recipientName, conversationId } = args;

        if (recipientName !== undefined) {
            const recipientToAdd = await User.findAll({where: { userName: {[Op.iLike]: recipientName }}})
        await Recipient.create({userId: recipientToAdd[0].id, conversationId})
        const sendBackRecipient = await Recipient.findByPk(recipientToAdd.id);
        return sendBackRecipient;
        } else {
            throw new UserInputError("Recipients field cannot be blank.")
        }


    },

        editMessage: async(root, args) => {
            const { messageId, editMessageText, userId } = args;
            await Message.update({ messageText: editMessageText }, { where: { id: messageId, senderId: userId }});

            //findAndCountAll seems weird, but our subscription expects something with rows and a count.
            const message = await Message.findAndCountAll({where: { id: messageId}, include: [{model: User, as: "sender"}], limit: 1 })
            pubsub.publish('NEW_MESSAGE', {messageSent: message});
        },

        deleteMessage: async(root, args) => {
            const { messageId, userId } = args;
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
            //TODO: If userId is hostId, do not allow & throw error.

            //create app
            const { userId, gameId, whyJoin, charConcept, charName, experience, hostId } = args;
            const newApp = await Application.create({userId, gameId, whyJoin, charConcept, charName, experience});

            //Add app to waitlist
            await Waitlist.create({userId, gameId, hostId, applicationId: newApp.id})
            return newApp;
        },

        submitCharacterCreation: async(root, args) => {
            const { userId, gameId, bio, name, imageUrl } = args;
            const character = await Character.create({userId, gameId, bio, name, imageUrl});
            return character;
        },

        editWaitlistApp: async(root, args) => {
            const { applicationId, userId, gameId, whyJoin, charConcept, charName, experience } = args;
            await Application.update({gameId, whyJoin, charConcept, charName, experience}, {where: { id: applicationId }});
            const returnApp = await Application.findByPk(applicationId);
            return returnApp;
        },

        approveApplication: async(root, args) => {
            const { applicationId } = args;
            const findAndUpdateAppToApprove = await Application.update({accepted: true}, {where: { id: applicationId}});
            const returnApp = await Application.findAll({where: {id: applicationId}})
            return returnApp;
        },

        ignoreApplication: async(root, args) => {
            const { applicationId } = args;
            const findAndUpdateAppToApprove = await Application.update({ignored: true}, {where: { id: applicationId}});
            const returnApp = await Application.findAll({where: {id: applicationId}})
            return returnApp;
        },

        acceptOffer: async(root, args) => {
            const { applicationId, userId, gameId } = args;
            await Application.update({offerAccepted: 'true'}, {where: { id: applicationId}});
            const addPlayerToGame = await PlayerJoin.create({userId, gameId});
            return addPlayerToGame;
        },

        declineOffer: async(root, args) => {
            const { applicationId } = args;
            //For some reason, false must be a string in order for this to work.
            await Application.update({offerAccepted: 'false'}, {where: { id: applicationId}});
            const returnApplication = Application.findAll({where: { id: applicationId }})
            return returnApplication;
        }
    },
    Subscription: {
        spectatorMessageSent: {
            subscribe: withFilter(() => pubsub.asyncIterator('NEW_SPECTATOR_MESSAGE'), (payload, variables) => {
                //Structure is the same for both games and non-games; no need for a second subscription.
                //We'll see if this is a game or conversation, first.
                //If it has a gameId at all, it's a game.
                if (variables.gameId !== null && variables.gameId !== undefined) {
                    //Yes, you have to cast it to a string...
                    return payload.spectatorMessageSent.rows[0].gameId.toString() === variables.gameId}
            }),
    },

            messageSent: {
                //Filter so we only broadcast/update game or conversation this applies to
                subscribe: withFilter(() => pubsub.asyncIterator('NEW_MESSAGE'), (payload, variables) => {
                    //Structure is the same for both games and non-games; no need for a second subscription.
                    //We'll see if this is a game or conversation, first.
                    //If it has a gameId at all, it's a game.
                    if (variables.gameId !== null && variables.gameId !== undefined) {
                        //Yes, you have to cast it to a string...
                        return payload.messageSent.rows[0].gameId.toString() === variables.gameId;
                    }
                        return payload.messageSent.rows[0].conversationId.toString() === variables.conversationId;
                }),
            },

    },
}


module.exports = resolvers;
