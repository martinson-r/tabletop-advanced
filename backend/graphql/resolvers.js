const Message = require('../models/message');
const Account = require('../models/account');
const Game = require('../models/game');
let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
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
            return Game.find({});
        },
        game: (obj, args, context, info) => {

            //Remember when writing typedefs that this returns an array
            return Game.findOne({_id: args._id})
            .exec();
        },
        messages: (obj, args, context, info) => {
            return Message.find({});
        },
        convos: (obj, args, context, info) => {
            return Message.find({ gameId: args.gameId })
            .populate('messages.userId')
            .exec();
        },
        getNonGameMessages: async(obj, args, context, info) => {
            console.log('ARGS', args)
            const { userId } = args;
            console.log('USERID NON GAME MSGS', userId)
            return Message.find({}).populate('recipients').exec();
        },
        //TODO: GetSingleNonGameConversation
        getSingleNonGameConversation: (obj, args, context, info) => {
            const { _id } = args;
            return Message.find({_id});
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

        //send message to game
        sendMessageToGame: async(root, args) => {

            const { gameId, messageText, userId } = args;
            console.log('ARGS', args)
            console.log('GAMEID', args.gameId)

            const findExistingMessages = await Message.find({gameId});
            console.log(findExistingMessages)

            if (findExistingMessages) {
                const updateMessages = {
                    $push:
                    { messages: { messageText, userId } },
                }

                //upsert: true means blockedUsers will be created if it doesn't exist
                const options = { upsert: true };

                const updatedMessages = await Message.findOneAndUpdate({gameId}, updateMessages, options)
                .populate('messages');
                return updatedMessages;
            }

            //If Message does not exist, create it.
                const newMessage = await Message.create({gameId, messages: [{ messageText, userId }] })
                .populate('messages');
                return newMessage;
        },

        sendNonGameMessage: async(root, args) => {
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
                const newMessage = await Message.create({recipients: [userId], messages: [{ messageText, userId: userId }] });
                newMessage.populate('recipients.email');
                console.log(
                'NEW MESSAGE', newMessage
                )
                return newMessage;
        },



    },



  };

  module.exports = resolvers;
