const { Message, Recipient, FollowedGame, FollowedPlayer, MetaGameMessageType, PlayerJoin, Conversation, Character, User, Game, Application, Language, Ruleset, GameType, AboutMe, Waitlist, CharacterSheet } = require('../db/models');
const { PubSub, withFilter } = require('graphql-subscriptions');
const { Op } = require('sequelize');
const { UserInputError } = require('apollo-server-express');
const bcrypt = require('bcryptjs');
const user = require('../db/models/user');
const game = require('../db/models/game');
const jsonwebtoken = require('jsonwebtoken');
const sequelize = require("sequelize");

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
        async me(_, args, { user }) {
            if(!user) throw new Error('You are not authenticated')
            return await User.findByPk(user.id)
          },
        //   async user(root, { id }, { user }) {
        //     try {
        //       if(!user) throw new Error('You are not authenticated!')
        //       return User.findByPk(id)
        //     } catch (error) {
        //       throw new Error(error.message)
        //     }
        //   },
          async allUsers(root, args, { user }) {
            try {
              if (!user) throw new Error('You are not authenticated!')
              return User.findAll()
            } catch (error) {
              throw new Error(error.message)
            }
          },
        users: (obj, args, context, info) => {
            //This is where you actually query the database.
            return User.findAll({})
          },
        user:(obj, args, context, info) => {
            if (!context.user) return null;
            id = context.user.id;
            return User.findByPk(id);
        },

        games: (obj, args, context, info) => {
            return Game.findAll({
                include: [ {model: User, as: "host"}]});
        },

        paginatedGames: (obj, args, context, info) => {

            const { offset } = args;

            console.log('offset args', offset);

            return Game.findAndCountAll({
                include: [ {model: User, as: "host"}],
                offset: offset,
                limit: 2
            });
        },

        mostPopularGames: async (obj, args, context, info) => {

            //This returns the 20 most popular games

            //1. find all games with most followers

            //2. find all games most recently updated

            //3. function to sort them

            let games = await Game.findAll({
            include: [ {model: User, as: "host"}, {
              model: User,
              as: "followinguser",
              attributes: ['id', [sequelize.fn('COUNT', sequelize.col('followinguser.id')), 'count']],
              duplicating: false,
              required: false,
            }],
            group: ['Game.id',
            'followinguser->FollowedGames.createdAt',
            'followinguser->FollowedGames.updatedAt',
            'followinguser->FollowedGames.gameId',
            'followinguser->FollowedGames.userId',
            'followinguser.id',
            'host.id'],
            limit: 20,
            order: [['count', 'DESC']]
        });

        console.log(games);

        let arrayOfGameIds = [];

        games.forEach((game) => {
            arrayOfGameIds.push(game.id);
        })

        //this will get the most recent messages
        //where the game id is unique
        let messages = await Message.findAll({

            where: { gameId: { [Op.or]: [...arrayOfGameIds]} },
            attributes:[[(sequelize.fn('DISTINCT'), sequelize.col('gameId')), "gameId"]],
            include: { model: Game,
                //missing FROM-clause entry for table \"host\"
                include: [{
                    model: User,
                    as: "host",
                    attributes: ["id", "userName"]}]
                },
            limit: 1,
            order: [['createdAt', 'DESC']],
            group: ['Game.id',
            "Message.gameId",
            "Message.createdAt",
            "Message.id",
            "Game->host.id",
            "Game->host.userName"
        ]})

        //Weight games:

        //order by most recent, then by followers.
        messages.sort(function(firstMessage, secondMessage) {
            return firstMessage.createdAt - secondMessage.createdAt
        });

        let gamesFromMessages = [];

        messages.forEach(message => gamesFromMessages.push(message.Game));

        //combined, with duplication
        let combined = [...gamesFromMessages, ...games];

        console.log('combined now minus msgs ....', combined)

        //we'll take the first place each one appears in the
        //merged array (games with more recent messages will always show up
        //first) and get rid of the next one

        deduped = combined.filter((game,index,array) =>
        array.findIndex(otherGame =>
            (otherGame.id === game.id)) === index)

            return deduped;

        },
        gamesWithRuleset: (obj, args, context, info) => {
            console.log(args);
            const {rulesetid} = args
            return Game.findAll({
                where: { ruleSetId: rulesetid },
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
            console.log('CHAR ID', characterId);
            return Character.findOne({where: { id: characterId }, include: [{ model: User }, { model: Game }]})
        },

        playercharactersheets:(obj, args, context, info) => {
            const { playerId } = args;
            return CharacterSheet.findAll({where: { playerId} });
        },

        getFollowedGames:(obj, args, context, info) => {
            //should followed games be private?
            const { playerId } = args;
            return User.findByPk(playerId, {include: [{model: Game, through: "FollowedGames", as: "followedgame",
            include: [{model: Message}]
        }]});
        },

        getFollowedTimeStamps: (obj, args, context, info) => {
            if (!context.user) return null;
            let userId = context.user.id;
            return FollowedGame.findAll({where: {userId} });
        },

        getFollowedPlayers:(obj, args, context, info) => {
            //should followed players be private?
            const { playerId } = args;
            let userId = playerId;
            console.log('player id ', userId)
            return User.findByPk(playerId, { include: [{model: User, through: "FollowedPlayers", as: "followedplayer"}]});
        },

        messages: (obj, args, context, info) => {
            return Message.findAll();
        },

        convos: async (obj, args, context, info) => {
            return Message.findAndCountAll({ where: {[Op.and]: [{ gameId: args.gameId, spectatorChat: false }]}, include: [
                {model: MetaGameMessageType},
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
            return Message.findAndCountAll({ where: {[Op.and]: [{ gameId: args.gameId, spectatorChat: true }]}, include: [
                {model: MetaGameMessageType}, {model: User, as: "sender",
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

            //console.log(msg.rows[0].MetaGameMessageType);
        },
        about: (obj, args, context, info) => {
            const { id } = args;

            return AboutMe.findAll({where: {userId: id}, include: User})
        },
        //Get all non game conversations for a specific user
        getNonGameConvos: (obj, args, context, info) => {
            //const { userId } = args;
            if (!context.user) return null;
            const userId = context.user.id;

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

        findUnreadMessages: (obj, args, context, info) => {
            if (!context.user) return null;
            const userId = context.user.id;
            return Recipient.findAll({ where: { userId, seen: false } })
        },

        getGamesHosting: (obj, args, context, info) => {
            //not protected so that users can eventually see what games other players are hosting
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
            const user = context.user.id;
            const { id, userId } = args;

            //If there's no user logged in, don't let people query directly
            if (!user) {
                return null;
            }

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
            //const { userId } = args;

            //no querying directly.
            const userId = context.user.id;
            if (!userId) return null;

            //does Application need gameId after all?
            //This is returning all games, not just games the user is in,
            //needs refactor for performance
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

        characterSheet: async(obj, args, context, info) => {
            const {characterSheetId} = args;
            return CharacterSheet.findByPk(characterSheetId);
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

        checkFollowPlayer: (obj, args, context, info) => {
            const {currentUserId, userId} = args;
            return FollowedPlayer.findOne({where: {[Op.and]:
                [{userId: currentUserId}, {playerId: userId}]}});
        }

    },
    Mutation: {
        sendMessageToGame: async(root,args,context) => {

        const { gameId, messageText, userId, offset, spectatorChat, metaGameMessageTypeId } = args;

        console.log('META TYPE ID: ', metaGameMessageTypeId)

        //if (!context.user) return null;
            const user = context.user.id;

            //Check to see if this is a dice roll.
            //Fun with regex
            //const numbers = messageText.match(/(\d+)[Dd](\d+)/);
            const numbers = messageText.match(/^(\/\/roll *)(\d+)[Dd](\d+)/);

            if (numbers !== null) {
                const result = rolldice(numbers[2], numbers[3]);

                //push roll results into messageText
                const messageText = `Dice roll result of ${numbers[2]}D${numbers[3]}: ${result}`;

                await Message.create({gameId, messageText, senderId: user, spectatorChat, metaGameMessageTypeId});

                const returnRoll = await Message.findAndCountAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}, {model: MetaGameMessageType}], order: [['createdAt', 'DESC']], limit:20});

                pubsub.publish('NEW_MESSAGE', {messageSent: returnRoll});
            } else if (numbers === null) {

                //check if string is empty or all whitespace
                if (messageText === '' || !messageText || /^\s*$/.test(messageText)) {
                    throw new UserInputError('Message cannot be blank.');
                } else {
            //backup in case this breaks
            //const senderId = userId;
            const senderId = context.user.id
            await Message.create({gameId,messageText,senderId,spectatorChat, metaGameMessageTypeId});

            const conversation = await Message.findAndCountAll({ where: { gameId }, include: [{model: User, as: "sender"}, {model: MetaGameMessageType}], order: [['createdAt', 'DESC']], limit:20});

            console.log(conversation.rows[0]);

            if (spectatorChat === false) {
                pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            }
                pubsub.publish('NEW_SPECTATOR_MESSAGE', {spectatorMessageSent: conversation});
        }
    }
    },

    sendNonGameMessages: async(root,args,context) => {

        const { conversationId, messageText, userId, offset } = args;
        if (!context.user) return null;

        if (messageText === '' || !messageText || /^\s*$/.test(messageText)) {
            throw new UserInputError('Message cannot be blank.');
        } else {
        //backup in case this breaks it
        //const senderId = userId;
        const senderId = context.user.id;
            await Message.create({conversationId,messageText,senderId});

            console.log('convo id:', conversationId)

            //set Seen back to false for recipients in this conversation, except the sender
            await Recipient.update({seen: false}, { where: { conversationId, [Op.not]: { userId: senderId } }});


            //console.log(recipient);

            const conversation = await Message.findAndCountAll({ where: { conversationId }, include: [{model: User, as: "sender"}], order: [['createdAt', 'DESC']], limit:20});

            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            return conversation;
        }

    },

    markMessagesSeen: (root,args, context) => {
        if (!context.user) return null;
        const userId = context.user.id;

        const { conversationId } = args;

        // let conversationsToMarkSeen = await Recipient.findAll({ where: { conversationId, userId, seen: false }});
        Recipient.update({seen: true}, { where: { conversationId, userId, seen: false }});
        return Recipient.findAll({ where: { conversationId, userId }});
    },

    startNewNonGameConversation: async(root,args, context) => {

        const { currentUserId, recipients, messageText } = args;
        if (!context.user) return null;

        const user = context.user.id;

        const arrayOfConversations = [];
        const arrayOfUsers = [];
        let newUser = false;

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
                await Recipient.create({userId: user, conversationId, seen: true})
            } catch(e) {
                console.log('Error', e)
            }

            //Add each recipient in recipients array
            recipients.forEach(async(recipient) => {
            //Op.iLike because we don't want to worry about case sensitivity
            try {
                let user = await User.findAll({where: { userName: {[Op.iLike]: recipient}
                }});
                await Recipient.create({userId: user[0].id, conversationId, seen: false});
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
        const findSenderConversations = await Recipient.findAll({ where: { userId: user }});
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
            const lookForAllRecipients = await Recipient.findAll({where: { userId: {[Op.or]: [...arrayOfUserIds, user]}}});

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


            const includeSender = [...arrayOfUserIds, user];

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
            const lookForAllRecipients = await Recipient.findAll({where: { userId: {[Op.or]: [...arrayOfUserIds, user]}}});

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
            const includeSender = [...arrayOfUserIds, user];

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
        if (!context.user) return null;
        const user = context.user.id;

        //Make sure the person adding recipients is a member of the
        //conversation
        let checkIfRecipient = await Recipient.findOne({ where: { recipientId: user, conversationId }});
        if (!checkIfRecipient) throw new Error("Not Authorized.");

        const recipientToAdd = await User.findAll({where: { userName: {[Op.iLike]: recipientName }}})
        await Recipient.create({userId: recipientToAdd[0].id, conversationId})
        const sendBackRecipient = await Recipient.findByPk(recipientToAdd.id);
        return sendBackRecipient;
    },

        editMessage: async(root, args, context) => {
            const { messageId, editMessageText, userId } = args;
            if (!context.user) return null;
            const user = context.user.id;

            await Message.update({ messageText: editMessageText }, { where: { id: messageId, senderId: user }});

            //findAndCountAll seems weird, but our subscription expects something with rows and a count.
            const message = await Message.findAndCountAll({where: { id: messageId}, include: [{model: User, as: "sender"}], limit: 1 })
            pubsub.publish('NEW_MESSAGE', {messageSent: message});
        },

        deleteMessage: async(root, args, context) => {
            const { messageId, userId } = args;
            if (!context.user) return null;
            const user = context.user.id;
            await Message.update({ deleted: true }, { where: { id: messageId, senderId: user }});
            const message = await Message.findAndCountAll({where: { id: messageId}, include: [{model: User, as: "sender"}], limit: 1 });
            pubsub.publish('NEW_MESSAGE', {messageSent: message});
            return message;
        },

        submitGame: async(root, args, context) => {
                        const { userId, title, description, gameLanguageId, gameRulesetId, gameTypeId, blurb } = args;

                        let errors = {};
                        if (!context.user) return null;
                        let user = context.user.id;

                        try {
                        //generate errors if information is missing.
                        if (!title || title === '' || /^\s*$/.test(title)) {
                            errors.title = 'Please add a title.';
                        }
                        if (!description || description === '' || /^\s*$/.test(description)) {
                            errors.description = 'Please add a longer description.';
                        }
                        if (!blurb || blurb === '' || /^\s*$/.test(blurb)) {
                            errors.blurb = 'Please add a short blurb.';
                        }

                        if (Object.keys(errors).length > 0) {
                            // now `errors` will throw to the `catch` block
                            throw errors;
                          }

                            const newGame = await Game.create({ hostId: user, blurb, title, description, gameTypeId, ruleSetId: gameRulesetId, languageId: gameLanguageId}, {include: [{model:User, as: "host"}, {model:GameType}, {model:Language}]})
                            return newGame;
                    } catch (err) {
                        throw new UserInputError('Bad User Input', { errors: err });
                    }

                    },
        changeEmail: async(root, args, context) => {
            const {userId, newEmail, changeEmailPassword} = args;
            if (!context.user) return null;
            const user = context.user.id;

            const foundUser = await User.findByPk(user);

            //TODO: Make sure it is actually an email address.
            //Throw error if not.

            const passwordMatch = await bcrypt.compare(
                changeEmailPassword,
                foundUser.hashedPassword.toString()
              );
            const checkIfEmail = newEmail.match(/([A-Z])*([a-z])*\w.+@+([A-Z])*([a-z])*\w\.([A-Z])*([a-z])*\w/);
              if (passwordMatch && checkIfEmail) {
            foundUser.email = newEmail;
            await foundUser.save();
            return foundUser;
              } else {
                //Provide an Apollo error that the user cannot do this.
                throw new UserInputError('Please enter a valid email address.');
              }
        },
        changePassword: async(root, args, context) => {
            const {userId, oldPassword, newPassword} = args;
            if (!context.user) return null;
            const contextUserId = context.user.id;
            const user = await User.findByPk(contextUserID);

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
        joinWaitlist: async(root, args, context) => {
            //If userId is hostId, do not allow & throw error.
        let errors = {}
        if (!context.user) return null;
        let user = context.user.id;

        console.log('USER....', user);

        if (!user) return null;
        try {

                const { userId, gameId, whyJoin, charConcept, charName, experience, hostId } = args;
                //create app
                if (user.toString() === hostId.toString()) {
                    errors.user = 'You cannot join the waitlist for your own game.';
                }

                if (!whyJoin || whyJoin === '' || /^\s*$/.test(whyJoin)) {
                    errors.whyJoin = 'Please explain why you would like to join this game.';
                }

                if (!charConcept || charConcept === '' || /^\s*$/.test(charConcept)) {
                    errors.charConcept = 'Please explain your character concept or background.';
                }

                if (!charName || charName === '' || /^\s*$/.test(charName)) {
                    errors.charName = 'Please provide a character name.';
                }

                if (!experience || experience === '' || /^\s*$/.test(experience)) {
                    errors.experience = 'Please describe your level of experience playing tabletop RPGs and play by post games.';
                }
                if (Object.keys(errors).length > 0) {
                    // now `errors` will throw to the `catch` block
                    throw errors;
                }
                const newApp = await Application.create({user, gameId, whyJoin, charConcept, charName, experience});

                //Add app to waitlist
                await Waitlist.create({userId: user, gameId, hostId, applicationId: newApp.id})
                return newApp;

            } catch(err) {
                throw new UserInputError('Bad User Input', { errors: err });
            }

        },

        newVisit: async(root, args, context) => {
            const {gameId} = args;
            if (!context.user) return null;
            const userId = context.user.id;
            FollowedGame.update({visited: new Date()},{where: {userId, gameId}});
            return FollowedGame.findOne({where: {userId, gameId}});
        },


        //Note that character creation fields can be incomplete since
        //creating a character can take time.
        submitCharacterCreation: async(root, args, context) => {
            if (!context.user) return null;
            const user = context.user.id;

            const { gameId, bio, name, imageUrl } = args;
            const character = await Character.create({userId: user, gameId, bio, name, imageUrl});
            return character;
        },
        updateCharacter: async(root, args, context) => {
            if (!context.user) return null;
            const user = context.user.id;

            //prevent non-user or lot logged in from altering character
            if (!user || character.userId !== user) return null;

            const {characterId, bio, name, imageUrl, characterSheetId} = args;
            const characterToUpdate = await Character.findByPk(characterId);
            await characterToUpdate.update({bio, name, imageUrl, characterSheetId});
            const updatedCharacter = await Character.findByPk(characterId);
            return updatedCharacter;
        },

        updateBio: async(root, args, context) => {
            const {currentUserId, userId, bio, firstName, avatarUrl, pronouns} = args;
            if (!context.user) return null;
            const user = context.user.id;

            //prevent unauthorized users from updating bio.
            if (!user || user !== userId) throw new UserInputError("Not authorized.");

                const aboutMeToUpdate = await AboutMe.findByPk(userId);
                await aboutMeToUpdate.update({bio, firstName, avatarUrl, pronouns});
                const updatedAboutMe = await AboutMe.findByPk(userId);
                return updatedAboutMe;

        },

        updateGame: async(root, args, context) => {
            const {userId, gameId, title, details, blurb, waitListOpen, active, deleted} = args;
            if (!context.user) return null;
            const user = context.user.id;

        //get the game's host id
        const gameToUpdate = await Game.findByPk(gameId);
        const hostId = gameToUpdate.hostId;

        //prevent unauthorized users from altering game info
            if (user.toString() === hostId.toString()) {
                // const aboutMeToUpdate = await AboutMe.findByPk(userId);
                await gameToUpdate.update({title, description: details, blurb, waitListOpen, active, deleted});
                const updatedGame = await Game.findByPk(gameId);
                return updatedGame;
            } else {
                throw new UserInputError("Not authorized.")
            }

         },

        editWaitlistApp: async(root, args, context) => {
            let errors = {};
            if (!context.user) return null;
            const user = context.user.id;
            try {
                const { applicationId, userId, gameId, whyJoin, charConcept, charName, experience } = args;
                if (!whyJoin || whyJoin === '' || /^\s*$/.test(whyJoin)) {
                    errors.whyJoin = 'Please explain why you would like to join this game.';
                }

                if (!charConcept || charConcept === '' || /^\s*$/.test(charConcept)) {
                    errors.charConcept = 'Please explain your character concept or background.';
                }

                if (!charName || charName === '' || /^\s*$/.test(charName)) {
                    errors.charName = 'Please provide a character name.';
                }

                if (!experience || experience === '' || /^\s*$/.test(experience)) {
                    errors.experience = 'Please describe your level of experience playing tabletop RPGs and play by post games.';
                }
                if (Object.keys(errors).length > 0) {
                    // now `errors` will throw to the `catch` block
                    throw errors;
                }

                let appToUpdate = await Application.findByPk(applicationId);

                //prevent unauthorized or not logged in users from altering application.
                if (!user || appToUpdate.userId !== user) throw new Error("Not authorized.");

                await Application.update({gameId, whyJoin, charConcept, charName, experience}, {where: { id: applicationId }});
                const returnApp = await Application.findByPk(applicationId);
                return returnApp;
            } catch(err) {
                throw new UserInputError("Bad User Input", {errors: err})
            }

        },

        approveApplication: async(root, args, context) => {
            const { applicationId } = args;
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw Error('Please log in.');

            //Prevent non-GMs from approving app
            let appToApprove = await Application.findByPk(applicationId, { include: {model: Game, through: "Waitlists"}});
            if (appToApprove.Games[0].hostId !== user) throw new Error("Not authorized.");

            const findAndUpdateAppToApprove = await Application.update({accepted: true}, {where: { id: applicationId}});
            const returnApp = await Application.findAll({where: {id: applicationId}})
            return returnApp;
        },

        ignoreApplication: async(root, args, context) => {
            const { applicationId } = args;
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw new Error("Please log in.");

            //Prevent non-GMs from ignoring app
            let appToIgnore = await Application.findByPk(applicationId, { include: {model: Game, through: "Waitlists"}});
            if (appToIgnore.Games[0].hostId !== user) throw new Error("Not authorized.");

            const findAndUpdateAppToApprove = await Application.update({ignored: true}, {where: { id: applicationId}});
            const returnApp = await Application.findAll({where: {id: applicationId}})
            return returnApp;
        },

        acceptOffer: async(root, args, context) => {
            const { applicationId, userId, gameId } = args;
            if (!context.user) return null;
            const user = context.user.id;

            if (!user) throw new Error("Please log in.");

            console.log(applicationId)

            //TODO: get app, compare app userId to user
            let appToCheck = await Waitlist.findAll({ where: { applicationId }});

            console.log(appToCheck[0].userId)
            if (appToCheck[0].userId.toString() !== user.toString()) throw new Error("Not authorized");

            await Application.update({offerAccepted: 'true'}, {where: { id: applicationId}});
            const addPlayerToGame = await PlayerJoin.create({userId, gameId});
            return addPlayerToGame;
        },

        declineOffer: async(root, args, context) => {
            const { applicationId } = args;
            if (!context.user) return null;
            const user = context.user.id;

            if (!user) throw new Error("Please log in.");

            //TODO: get app, compare app userId to user
            let appToCheck = await Waitlist.findAll({ where: { applicationId }});
            if (appToCheck.userId.toString() !== user.toString()) throw new Error("Not authorized");

            //For some reason, false must be a string in order for this to work.
            await Application.update({offerAccepted: 'false'}, {where: { id: applicationId}});
            const returnApplication = Application.findAll({where: { id: applicationId }})
            return returnApplication;
        },

        createCharacterSheet: async(root, args, context) => {
            const {playerId, name, characterClass} = args;
            if (!context.user) return null;
            const user = context.user.id

            console.log(user);

            if (!user) throw new Error("Please log in.");
            const characterSheet = await CharacterSheet.create({age, playerId: user, name, class: characterClass});
            return characterSheet;
        },

        followGame: async(root, args, context) => {
            const {userId, gameId} = args;
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw new Error("Not Authorized.");
            let followCheck = await FollowedGame.findOne({where: {[Op.and]:
                [{userId: user}, {gameId}]}});

            //Just in case, make sure game cannot be followed more than once
            if (followCheck) {
                return followCheck;
            } else {
                const followedTheGame = await FollowedGame.create({userId: user, gameId});
                return followedTheGame;
            }
        },

        unFollowGame: async(root, args, context) => {
            const {userId, gameId} = args;
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw new Error("Not Authorized.");
            //TODO: mismatch between followgame and user error
            let game = await FollowedGame.destroy({where: {[Op.and]:
                [{userId: user}, {gameId}]}});
                console.log(game);
            return FollowedGame.findOne({where: {gameId}})
        },

        followPlayer: async(root, args, context) => {
            const {currentUserId, userId} = args;
            if (!context.user) return null;
            const user = context.user.id;
            let otherUserId = userId;

            if (!user) throw new Error("Not Authorized.");

            //confusing and my own fault for naming variables this way
            let followCheck = await FollowedPlayer.findOne({where: {[Op.and]:
                [{userId: user}, {playerId: otherUserId}]}});

            //Just in case, make sure game cannot be followed more than once
            if (followCheck) {
                return followCheck;
            } else {
                const followedThePlayer = await FollowedPlayer.create({userId: currentUserId, playerId: otherUserId});
                return followedThePlayer;
            }
        },

        unFollowPlayer: async(root, args, context) => {
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw new Error("Not authorized.");
            const {currentUserId, userId} = args;
            await FollowedPlayer.destroy({where: {[Op.and]:
                [{userId: user}, {playerId: userId}]}});
            return FollowedPlayer.findOne({where: {playerId: userId}})
        },

        removePlayer: async(root, args, context) => {
            // TODO:
            // remove the player from the game
            // retire the character (note optional)

            //TODO: check userId to make sure it is the DM of this game
            const {gameId, playerId, retireNote, userId} = args;
            if (!context.user) return null;
            const user = context.user.id;

            let thisGame = await Game.findByPk(gameId);
            console.log(thisGame);


            if (thisGame.hostId.toString() === user.toString() || playerId.toString() === user.toString()) {
                await PlayerJoin.destroy({where: {[Op.and]:
                    [{userId: playerId}, {gameId}]}});
                await Character.update({ retiredNote: retireNote, retired: true }, {where: {[Op.and]:
                    [{userId: playerId}, {gameId}]}});
                    //may need to change what it returns
                return PlayerJoin.findAll({where: {gameId}});
            } else {
                throw new UserInputError('Not Authorized to do that.');
            }
        },

        retireCharacter: async(root, args, context) => {
            if (!context.user) return null;
            const user = context.user.id;
            if (!user) throw Error("Not authorized");
            const {userId, retireNote, characterId} = args;
            console.log(args);
            //Op.and makes sure the user trying to retire this character is authorized.
            return Character.update({ retiredNote: retireNote, retired: true }, {where: {[Op.and]:
                [{userId: user}, {id: characterId}]}});
        },

        async registerUser(root, { userName, email, password, confirmPassword }) {
            if (password === confirmPassword) {
                try {
                    const user = await User.create({
                      userName,
                      email,
                      hashedPassword: await bcrypt.hashSync(password)
                    })

                    const token = jsonwebtoken.sign(
                      { id: user.id, email: user.email},
                      process.env.JWT_SECRET,
                      { expiresIn: '1y' }
                    )
                    return {
                        token, user
                    //   token, id: user.id, username: user.username, email: user.email, message: "Authentication successful"
                    }
                  } catch (error) {
                    throw new Error(error.message)
                  }
            } else {
                throw new Error('Confirm password and password must match.')
            }
          },
          async login(_, { userName, password }) {

            console.log('PASSWORD', password);
            try {
              const user = await User.findOne({ where: { userName }})
              if (!user) {
                throw new Error('No user with that username')
              }
              const isValid = await bcrypt.compare(password, user.hashedPassword.toString())
              if (!isValid) {
                throw new Error('Incorrect password')
              }
              // return jwt
              const token = jsonwebtoken.sign(
                { id: user.id, email: user.email},
                process.env.JWT_SECRET,
                { expiresIn: '1d'}
              )
              return {
               token, user
              }
          } catch (error) {
            throw new Error(error.message)
          }
        },

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
                         //return payload.messageSent.rows[0]
                    }
                         return payload.messageSent.rows[0].conversationId.toString() === variables.conversationId;
                    }),
            },


    },
}


module.exports = resolvers;
