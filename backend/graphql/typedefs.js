const { gql } = require('apollo-server-express');
const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    games: [Game]
    game(id: ID!): Game
    messages: [Message]
    convos(gameId: ID): Conversation
    getNonGameMessages(userId: ID!): [Message]
    getSingleNonGameConversation(id: ID!): [Message]
    checkWaitList(id: ID, userId: ID!): [Game]
  }
  type User {
    id: ID,
    email: String,
    userName: String,
    hashedPassword: String,
    blockedUsers: [User],
    emailVerified: Boolean,
    mutedPlayers: [User],
    playedWith: [User],
    hideStrangers: Boolean,
    sportsmanship: [String],
    gamesHosted: Int,
    gamesPlayed: Int,
    reactionsReceived: Int,
    reactionsGiven: Int,
    sessionsPlayed: Int,
    hostPoints: Int,
    badges: [Badge],
    firstName: String,
    pronouns: String,
    bio: String,
    preferredLanguages: [Language],
    avatar: String,
    profanity: Boolean,
    books: [Book],
    rulesets: [Ruleset],
    gameTimes: [GameTime],
    gameTypes: [GameType],
    gameFrequency: [GameFrequency],
    homebrew: Boolean,
    houserules: Boolean,
    gameCleanliness: [GameCleanliness],
    postalCode: String,
    stateOrProvince: StateProvince,
    country: Country,
    timeZone: TimeZone
  }
  type Language {
      language: String
  }
  type Book {
      title: String,
      author: String,
      publisher: String,
      description: String
  }
  type Ruleset {
      name: String
  }
  type GameTime {
      startHour: Int,
      endHour: Int,
      startMinutes: Int,
      endMinutes: Int,
      timeZoneId: Int,
      amPmId: Int
  }
  type GameType {
      type: String
  }
  type TimeZone {
      timeZone: String
  }
  type GameFrequency {
      frequency: String
  }
  type GameCleanliness {
      cleanliness: String
  }
  type StateProvince {
      name: String
  }
  type Country {
      name: String
  }
  type Badge {
      id: ID,
      imageUrl: String,
      title: String,
      description: String
  }
  type Conversation {
      id: ID,
      gameId: Game
  }
  type Game {
    id: ID,
    title: String,
    description: String,
    premium: Boolean,
    remote: Boolean,
    User: User,
    host: User,
    players: [User],
    spectators: [User]
    waitlist: [Waitlist]
    ruleSetId: [Ruleset]
  }
  type Message {
    id: ID,
    userId: User,
    messageText: String,
    createdAt: String,
    deleted: Boolean,
    reported: Boolean,
    metaGameMessageTypeId: ID
  }
  type MetaGameMessageType {
      metaGameMessageType: String
  }
  type Waitlist {
      id: ID,
      userId: User,
      whyJoin: String,
      charConcept: String,
      experience: String,
      charName: String
  }
  type Messages {
     id: ID,
     gameId: Game,
     recipients: [User],
     isMuted: Boolean,
     isGame: Boolean,
     conversationId: ID,
  }
  type Mutation {
    blockUser(emailToBlock: String!, blockerEmail: String!): User
    sendMessageToGame(gameId: ID!, userId: ID!, messageText: String!): Messages
    sendNonGameMessage(userId: ID!, messageText: String!, id: ID!): Messages
    submitGame(userId: ID!, title: String!, description: String!): Game
    submitWaitlistApp(userId: ID!, charName: String!, charConcept: String!, whyJoin: String!, experience: String!, gameId: ID!): Game
  }
  type Subscription {
    messageAdded(gameId: ID!): Messages
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefs;
