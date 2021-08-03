const { gql } = require('apollo-server-express');
// convos(gameId: ID, offset: Int): [Message]

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
    about(id: ID): [AboutMe]
    games: [Game]
    rulesets: [Ruleset]
    game(gameId: ID!): Game
    messages: [Message]
    convos(gameId: ID, offset: Int): CountAll
    getNonGameConvos(userId: ID!): [User]
    getNonGameMessages(conversationId: ID, offset: Int): CountAll
    checkWaitList(id: ID, userId: ID!): [Game]
    getGameCreationInfo: GameCreationInfo
    getGamesHosting(userId: ID): [Game]
    getApplication(gameId: ID, applicationId: ID): [Application]
    getPlayingWaitingGames(userId: ID): [User]
    getWaitlistGames(userId: ID): [Game]
    getGamesPlayingIn(userId: ID): [Game]
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
    timeZone: TimeZone,
    Conversation: [Conversation]
    recipient: [User]
    Game: Game
    applicant: [Game]
    player: [Game]
    Applications: [Application]
    gameApplication: [Application]
    applicationOwner: [Application]
  }
  type Ruleset {
    id: ID,
    ruleset: String
  }
  type Conversation {
    id: ID
    recipient: [Recipient]
  }
  type Recipient {
    id: ID,
    userId: ID,
    userName: String,
    conversationId: ID,
    messageId: ID,
    Message: [Message]
    recipient: User
  }
  type AboutMe {
    bio: String,
    userId: ID,
    User: User,
    pronouns: String,
    firstName: String,
    imageUrl: String
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
    spectators: [User],
    waitlist: [Waitlist],
    ruleSetId: ID,
    languageId: ID,
    gameTypeId: ID,
    Ruleset: Ruleset,
    Language: Language,
    GameType: GameType,
    allowPlayerEdits: Boolean,
    allowPlayerDeletes: Boolean,
    active: Boolean,
    applicant: [User],
    Applications: [Application]
  }
  type Application {
    id: ID
    userId: ID
    gameId: ID
    whyJoin: String
    hostId: ID
    gameHost: [User]
    charConcept: String
    charName: String
    experience: String
    ignored: Boolean
    accepted: Boolean
    Users: [User]
    applicant: User
    applicationOwner: [User]
    createdAt: String
    Games: [Game]
    offerAccepted: Boolean
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
  type Player {
    userId: ID,
    player: [User]
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
    editMessage(messageId: ID, userId: ID, editMessageText: String):CountAll
    deleteMessage(messageId: ID, userId: ID): CountAll
    sendNonGameMessages(userId: ID!, messageText: String!, conversationId: ID): CountAll
    submitGame(userId: ID!, title: String!, description: String!, gameTypeId: ID!, gameRulesetId: ID!, gameLanguageId: ID!): Game
    submitWaitlistApp(userId: ID!, charName: String!, charConcept: String!, whyJoin: String!, experience: String!, gameId: ID!): Game
    changeEmail(userId: ID!, newEmail: String!, changeEmailPassword: String!): User
    changePassword(userId: ID!, newPassword: String!, oldPassword: String!): User
    joinWaitlist(hostId: ID, userId: ID, gameId: ID, whyJoin: String, charConcept: String, charName: String, experience: String): Application
    startNewNonGameConversation(currentUserId: ID, recipients: [String]): Conversation
    addRecipient(recipientName: String, conversationId: ID): Recipient
    approveApplication(applicationId: ID): [Application]
    ignoreApplication(applicationId: ID): [Application]
    declineOffer(applicationId: ID): Application
    acceptOffer(applicationId: ID, gameId: ID, userId: ID): Application
    editWaitlistApp(applicationId: ID, userId: ID, gameId: ID, whyJoin: String, charConcept: String, charName: String, experience: String): Application
  }
  type Subscription {
    messageSent(gameId: ID, conversationId: ID): CountAll,
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefs;
