const Account = require('../models/account');
const Game = require('../models/game');
const Message = require('../models/message');
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
            console.log('SINGLE GAME ARGS', args);

            //Remember when writing typedefs that this returns an array
            return Game.find({_id: args._id})
            .exec();
        },
        messages: (obj, args, context, info) => {
            return Message.find({});
        },
        convos: (obj, args, context, info) => {
            return Message.find({ gameId: args.gameId })
            .populate('messages.userId');
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
                .populate('messages.userId');
                return updatedMessages;
            }
                const newMessage = await Message.create({gameId: gameId, messages: [{ messageText, userId }] })
                .populate('messages.userId');
                return newMessage;


        }
    },
  };

  module.exports = resolvers;
