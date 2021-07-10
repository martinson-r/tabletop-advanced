const { Message, User, Game, Application } = require('../db/models');
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

};

// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        users: (obj, args, context, info) => {
            //This is where you actually query the database.
            return User.findAll({})
          },
        user: async(obj, args, context, info) => {
            const id = args._id;
            const user = await User.findByPk(id);
            return user;
        },
        games: async(obj, args, context, info) => {
            let games = await Game.findAll({
                include: [{model: User, as: "host"}]
            });
            console.log(games);
            return games;
        },
        game: async (obj, args, context, info) => {
            const id = args.id;
            let game = await Game.findByPk(id, {include: {model: User, as: "host"}});
            return game;
        },
        messages: async(obj, args, context, info) => {
            const message = await Message.findAll({});
            return message;
        },

        convos: async (obj, args, context, info) => {
            const conversation = await Message.findAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}]});
            //TODO: Pagination

            return conversation;
        },
        getNonGameMessages: async(obj, args, context, info) => {
            const { userId } = args;
            return Message.findAll({recipients: [userId]})
        },
        //TODO: GetSingleNonGameConversation
        getSingleNonGameConversation: (obj, args, context, info) => {
            const { id } = args;
            return Message.findAll({id});
        },

        checkWaitList: async (obj, args, context, info) => {
            const { id, userId } = args;

            //check if this user has applied to this game before. Must match both game _id and
            //userId in waitlist.
            const game = await Game.findAll({ where: {id}});
            return game;
        }
    },
    Mutation: {
        sendMessageToGame: async(root,args) => {
            const { gameId, messageText, userId } = args;
            const newMessage = await Message.create({gameId,messageText,senderId:userId});
            const conversation = await Message.findAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}]});
            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            console.log('CONVERSATION', conversation)
            return conversation;
        },
    },
    Subscription: {
        messageSent: {
          subscribe: withFilter(() => pubsub.asyncIterator('commentAdded'), (payload, variables) => {
             console.log('payload', payload);
            return payload.messageSent.gameId === variables.gameId;
          }),
        }
    },
}



module.exports = resolvers;
