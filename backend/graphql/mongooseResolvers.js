const Message = require('../models/message');
const Account = require('../models/account');
const Game = require('../models/game');
let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const { PubSub, withFilter } = require('graphql-subscriptions');

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

}

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        accounts: (obj, args, context, info) => {
            //This is where you actually query the database.
            return Account.find({})
            .populate('blockedUsers');
          },
        account: (obj, args, context, info) => {
            return Account.find({_id: args._id})
            .populate('blockedUsers')
            .populate('mutedPlayers')
            .populate('playedWith')
            .exec();
        },
        games: (obj, args, context, info) => {
            //rolltest, 5 d 20
            //console.log(rolldice(5,20));


            return Game.find({})
            .populate('host')
            .exec();
        },
        game: async (obj, args, context, info) => {

            //Remember when writing typedefs that this returns an array
            let game = await Game.findOne({_id: args._id})
            .populate('host')

            return game;
        },
        messages: (obj, args, context, info) => {
            return Message.find({});
        },
        convos: async (obj, args, context, info) => {

            //populate messages.userId to get email etc data
            const messagesToTruncate = await Message.find({ gameId: args.gameId })
            //.skip(0)
            //.sort({'date': 'asc'})
            //.limit(5)
            .populate('messages.userId');

            //Limit number of messages displayed to something reasonable.
            //Remember that messagesToTruncate is an array because
            //find returns an array. We have to key in to index 0 and use splice and mutate array.
            //messagesToTruncate[0].messages.splice(0, messagesToTruncate[0].messages.length-10)

            //Honestly, might be best to move messages over into their own model to allow
            //for better pagination.

            return messagesToTruncate;
        },
        getNonGameMessages: async(obj, args, context, info) => {
            const { userId } = args;
            return Message.find({recipients: [userId]}).populate('recipients').exec();
        },
        //TODO: GetSingleNonGameConversation
        getSingleNonGameConversation: (obj, args, context, info) => {
            const { _id } = args;
            return Message.find({_id});
        },

        checkWaitList: async (obj, args, context, info) => {
            const { _id, userId } = args;

            //check if this user has applied to this game before. Must match both game _id and
            //userId in waitlist.
            const game = await Game.find({ _id, "waitlist.userId": { "$in": [userId] } });
            return game;
        },
    },
    Mutation: {
        //Block accounts
        blockAccount: async(root, args) => {
            const accountToBlock = await Account.findOne({email: args.emailToBlock});

            //push id of user to be blocked into blockedUsers
            const blockAccount = { $push:
                { blockedUsers: accountToBlock._id },
             }

             //upsert: true means blockedUsers will be created if it doesn't exist
             const options = { upsert: true };

            const blocker = await Account.findOneAndUpdate({email: args.blockerEmail}, blockAccount, options);
            return blocker;
          },

        sendMessageToGame: async(root, args) => {

            const { gameId, messageText, userId } = args;

            //First, check to see if the game already has existing messages
            const findExistingMessages = await Message.find({gameId});

            if (findExistingMessages.length) {

                //Next, check to see if this is a dice roll.
            //Fun with regex
            let numbers = messageText.match(/(\d+)[Dd](\d+)/);

            if (numbers.length) {
                const result = rolldice(numbers[1], numbers[2]);
                console.log(result)

                //push roll results into messageText
                const updateMessages = {
                    $push:
                    { : { messageText: `Dice roll result of ${numbers[1]}D${numbers[2]}: ${result}`, userId } } }

                //upsert: true means something will be created if it doesn't exist
                const options = { upsert: true };

                const updatedMessages = await Message.findOneAndUpdate({gameId}, updateMessages, options)
                .populate('messages.userId')

                const returnNewRoll = await Message.findOne({gameId})
                .populate('messages.userId')

                console.log('UPDATED', returnNewRoll)

                return returnNewRoll;
            }

                //If it's not a dice roll, push new messageText into existing game messages
                const updateMessages = {
                    $push:
                    { messages: { messageText, userId } },
                }

                //upsert: true means something will be created if it doesn't exist
                const options = { upsert: true };

                const updatedMessages = await Message.findOneAndUpdate({gameId}, updateMessages, options)
                updatedMessages.populate('messages.userId');

                //TODO: paginate
                //right now, this just limits to last 10 messages, no way to see older messages
                //updatedMessages is NOT an array
                //updatedMessages.messages.splice(0, updatedMessages.messages.length-10)
                //May need to reconsider Postgres since cramming thousands of messages into an array
                //we can't paginate is less than ideal.

                //Broadcast to websocket
                pubsub.publish('NEW_MESSAGE', { messageAdded: updatedMessages })

                return updatedMessages;
            }

            //If no Game chat exists, create it.

                await Message.create({gameId, messages: [{ messageText, userId }] });

                //Hard lesson: you can't populate a newly created Message. You have to create and then query
                //in order to populate data.
                const grabMessageArray = await Message.find({gameId}).populate('messages.userId');
                const updatedMessages = grabMessageArray[0];

                //Broadcast to websocket
                pubsub.publish('NEW_MESSAGE', { messageAdded: updatedMessages })

                return updatedMessages;

        },

        sendNonGameMessage: async(root, args) => {

            //send a message to an existing conversation
            const { userId, messageText, _id } = args;

            //look for existing message with messageId
            const findExistingMessage = await Message.find({_id});

            //if existing message is found, push new messages etc into it
            //users are also added as recipients to their own messages
            if (findExistingMessage.length) {
                const updateMessages = {
                    $push:
                    { recipients: [{ userId }], messages: { messageText, userId } },
                }

                //upsert: true means column will be created if it doesn't exist
                const options = { upsert: true };

                const updatedMessages = await Message.findOneAndUpdate({_id, updateMessages, options})
                .populate('messages.userId')
                .populate('recipients')
                .execPopulate();
                return updatedMessages;
            }

            //if Message did not exist, create it
                const newMessage = await Message.create({recipients: [userId, recipientId], messages: [{ messageText, userId: userId }] });
                //newMessage can only be populated after it has been created.
                newMessage.populate('recipients');
                return newMessage;
        },

        submitGame: async(root, args) => {
            const { userId, title, description } = args;

            const newGame = await Game.create({ host: userId, title, description});
            newGame.populate('host');

            return newGame;

        },

        submitWaitlistApp: async(root, args) => {
            const { userId, whyJoin, gameId, charConcept, charName, experience } = args;

            console.log(args);

            //upsert: true means column will be created if it doesn't exist
            const options = { upsert: true };

            const addApp = {
                $push:
                { waitlist: [{userId, whyJoin, charConcept, charName, experience}] },
            }

            const apply = await Game.findOneAndUpdate({_id: gameId}, addApp, options)
            .populate('host');

            console.log(apply);

            return apply;

        },


        // - add a new recipient to an existing Message
        // - TODO: typedefs and front end
        // addNewRecipientToChat: async(root, args) => {
        //     const { userId, messageText, recipientId, _id } = args;

        //     //look for existing message with messageId
        //     const findExistingMessage = await Message.find({_id});

        //     //if existing message is found, push new recipient into it
        //     if (findExistingMessage.length) {
        //         const updateRecipients = {
        //             $push:
        //             { recipients: [{ recipientId }] },
        //         }

        //         //upsert: true means column will be created if it doesn't exist
        //         const options = { upsert: true };

        //         const messageWithUpdatedRecipients = await Message.findOneAndUpdate({_id, updateRecipients, options})
        //         .populate('messages.userId')
        //         .populate('recipients')
        //         .execPopulate();
        //         return messageWithUpdatedRecipients;
        //     }
        // },

        // createNewNonGameChat: async (root, args) => {
        //     // - create a new Message, if the user indicates they want one, and add a new recipient to that Message
        //     // - TODO: typedefs and front end
        //     // - TODO: Message another user from their profile page
        //     // - TODO: Add a user to a message directly by typing in their name
        //     const { userId, recipientId } = args;
        //     const newMessage = await Message.create({recipients: [userId, recipientId], messages: [{ messageText, userId: userId }] });
        //         //newMessage can only be populated after it has been created.
        //         newMessage.populate('recipients');
        //         return newMessage;
        // },

    },
    Subscription: {
        messageAdded: {
            subscribe:
             withFilter(
                () => pubsub.asyncIterator('NEW_MESSAGE'),
                (payload, variables) => {
                  // Only push an update if the message is on
                  // the correct Game for this operation
                  // variables come through as string, so cast either to string or to int either way
                  return (payload.messageAdded.gameId.toString() === variables.gameId);
                },
              ),

              //old publisher
            //  () => pubsub.asyncIterator('NEW_MESSAGE')
            }
    },
  };

  module.exports = resolvers;
