const { gql } = require('apollo-server-express');
// convos(gameId: ID, offset: Int): [Message]

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    games: [Game]
    game(id: ID!): Game
    messages: [Message]
    convos(gameId: ID, offset: Int): CountAll
    getNonGameMessages(userId: ID!): [Message]
    getSingleNonGameConversation(id: ID!): [Message]
    checkWaitList(id: ID, userId: ID!): [Game]
    getGameCreationInfo: GameCreationInfo
  }
  type GameCreationInfo {
    languages: [Language],
    rulesets: [Ruleset]
    gameTypes: [GameType]
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
      ruleset: String
  }
  type GameType {
      type: String
  }
  type CountAll {
    rows: [Message]
    count: Int
  }
  type GameTime {
      startHour: Int,
      endHour: Int,
      startMinutes: Int,
      endMinutes: Int,
      timeZoneId: Int,
      amPmId: Int
  }
  type rows {
    rows: [Message]
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
  type Game {
    id: ID,
    title: String,
    description: String,
    premium: Boolean,
    remote: Boolean,
    host: User,
    players: [User],
    spectators: [User]
    waitlist: [Waitlist]
    ruleSetId: ID
    languageId: ID
    gameTypeId: ID
    Ruleset: Ruleset
    Language: Language
    GameType: GameType
  }
  type Message {
    id: ID,
    userId: ID,
    senderId: ID,
    messageText: String,
    createdAt: String,
    deleted: Boolean,
    reported: Boolean,
    metaGameMessageTypeId: ID,
    User: User,
    sender: User
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
  type Mutation {
    blockUser(emailToBlock: String!, blockerEmail: String!): User
    sendMessageToGame(gameId: ID, userId: ID, messageText: String): CountAll
    sendNonGameMessage(userId: ID!, messageText: String!, id: ID!): [Message]
    submitGame(userId: ID!, title: String!, description: String!, gameTypeId: ID!, gameRulesetId: ID!, gameLanguageId: ID!): Game
    submitWaitlistApp(userId: ID!, charName: String!, charConcept: String!, whyJoin: String!, experience: String!, gameId: ID!): Game
    changeEmail(userId: ID!, newEmail: String!): User
  }
  type Subscription {
    messageSent(gameId: ID!): CountAll
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefs;
