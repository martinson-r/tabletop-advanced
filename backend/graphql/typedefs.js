const { gql } = require('apollo-server-express');
const Account = require('../models/account');

//type Account defines what you expect to get back from Query accounts:
const typeDefs = gql`
  type Query {
    accounts: [Account]
    account(_id: ID!): [Account]
    games: [Game]
    game(_id: ID!): [Game]
    messages: [Messages]
    convos(gameId: ID): [Messages]
  }
  type Account {
    _id: ID,
    email: String,
    userName: String,
    hashedPassword: String,
    blockedUsers: [Account],
    emailVerified: Boolean,
    mutedPlayers: [Account],
    playedWith: [Account],
    hideStrangers: Boolean,
    sportsmanship: [String],
    gamesHosted: Int,
    gamesPlayed: Int,
    reactionsReceived: Int,
    reactionsGiven: Int,
    sessionsPlayed: Int,
    hostPoints: Int,
    badges: [String],
    firstName: String,
    pronouns: [String],
    bio: String,
    preferredLanguages: [String],
    avatar: String,
    profanity: Boolean,
    books: [String],
    rulesets: [String],
    gameTimes: [String],
    gameTypes: [String],
    gameFrequency: [String],
    homebrew: Boolean,
    houserules: Boolean,
    gameCleanliness: [String],
    postalCode: String,
    stateOrProvince: String,
    country: String,
    timeZone: String
  }
  type Game {
    _id: ID,
    title: String,
    description: String,
    premium: Boolean,
    remote: Boolean
  }
  type Message {
    userId: Account,
    recipient: [Account],
    messageText: String
  }
  type Messages {
     _id: ID,
     gameId: ID,
     isMuted: Boolean,
     isGame: Boolean,
     messages: [Message]
  }
  type Mutation {
    blockAccount(emailToBlock: String, blockerEmail: String): Account
    sendMessageToGame(gameId: ID, userId: ID, messageText: String): Messages
  }
`;

module.exports = typeDefs;
