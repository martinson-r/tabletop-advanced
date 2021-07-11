const { Message, User, Game, Application, Language, Ruleset, GameType } = require('../db/models');
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

        const { gameId, messageText, userId } = args;

            //Check to see if this is a dice roll.
            //Fun with regex
            const numbers = messageText.match(/(\d+)[Dd](\d+)/);

            console.log('NUMBERS', numbers)

            if (numbers !== null) {
                const result = rolldice(numbers[1], numbers[2]);

                //push roll results into messageText
                const messageText = `Dice roll result of ${numbers[1]}D${numbers[2]}: ${result}`;

                //upsert: true means something will be created if it doesn't exist
                const roll = await Message.create({gameId, messageText, senderId: userId});

                const returnRoll = await Message.findAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}]});
                pubsub.publish('NEW_MESSAGE', {messageSent: returnRoll});
                return returnRoll;

            }

            const senderId = userId;
            const newMessage = await Message.create({gameId,messageText,senderId});
            const conversation = await Message.findAll({ where: { gameId: args.gameId }, include: [{model: User, as: "sender"}]});
            pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            return conversation;
        },
        submitGame: async(root, args) => {
                        const { userId, title, description, gameLanguageId, gameRulesetId, gameTypeId } = args;
                        console.log(args);

                        const newGame = await Game.create({ hostId: userId, title, description, gameTypeId, ruleSetId: gameRulesetId, languageId: gameLanguageId}, {include: [{model:User, as: "host"}, {model:GameType}, {model:Language}]})
                        return newGame;
                    }
    },
    Subscription: {
                messageSent: {
                //   subscribe: withFilter(() => pubsub.asyncIterator('NEW_MESSAGE'), (payload, variables) => {
                //      console.log('payload', payload);
                //     return payload.messageSent.gameId === variables.gameId;
                //   }),
                subscribe: () => pubsub.asyncIterator('NEW_MESSAGE')
             }
            },
}


module.exports = resolvers;
