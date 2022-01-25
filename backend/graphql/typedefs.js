const { gql } = require('apollo-server-express');
// convos(gameId: ID, offset: Int): [Message]

const typeDefs = gql`
  type Query {
    users: [User]
    about(id: ID): [AboutMe]
    games: [Game]
    gamesWithRuleset(rulesetid: ID): [Game]
    character(userId: ID, gameId: ID): Character
    rulesets: [Ruleset]
    game(gameId: ID!): Game
    messages: [Message]
    convos(gameId: ID, offset: Int): CountAll
    spectatorConvos(gameId: ID, offset: Int): CountAll
    getNonGameConvos(userId: ID!): [User]
    getNonGameMessages(conversationId: ID, offset: Int): CountAll
    checkWaitList(id: ID, userId: ID!): [Game]
    checkApplied(gameId: ID, userId: ID): [Waitlist]
    getGameCreationInfo: GameCreationInfo
    getGamesHosting(userId: ID): [Game]
    getApplication(gameId: ID, applicationId: ID): [Application]
    getPlayingWaitingGames(userId: ID): [User]
    getWaitlistGames(userId: ID): [Game]
    getGamesPlayingIn(userId: ID): [Game]
    getFollowedGames(playerId: ID): User
    getFollowedPlayers(playerId: ID): User
    simpleSearch(text: String): resultsArray
    characterById(characterId: ID): Character
    charactersheet(charactersheetid: ID): CharacterSheet
    playercharactersheets(playerId: ID): [CharacterSheet]
    checkFollowPlayer(currentUserId: ID, userId: ID): User
    characterSheet(characterSheetId: ID): CharacterSheet
    getFollowedTimeStamps(playerId: ID): [FollowedGame]
    user: User
    allUsers: [User!]!
    me: User
  }
  type AuthPayload {
    token: String!
    user: User!
  }
  type FollowedGame {
    id: ID,
    userId: ID,
    gameId: ID,
    visited: String

  }
  type FollowedPlayer {
    id: ID,
    userId: ID,
    playerId: ID
  }
  type GameCreationInfo {
    languages: [Language],
    rulesets: [Ruleset]
    gameTypes: [GameType]
  }
  type resultsArray {
    wordsArray: [[Game]]
  }
  type CharacterSheet {
    id: ID,
    playerId: ID,
    name: String,
    age: Int,
    intelligence: Int,
    strength: Int,
    wisdom: Int,
    agility: Int,
    dexterity: Int,
    constitution: Int,
    charisma: Int,
    class: String,
    level: Int,
    alignment: String,
    background: String,
    gender: String,
    armor: String,
    armorclass: Int,
    initiative: String,
    speed: Int,
    maxhp: Int,
    currenthp: Int,
    temphp: Int,
    proficiencybonus: Int,
    passiveperception: Int,
    spellsweapons: String,
    spellatkbonus: Int,
    spellsknown: String,
    preparedspells: String,
    spellsavedc: Int,
    cantripsknown: String,
    slotlevel: Int,
    traits: String,
    languages: String,
    proficiencies: String,
    weaponsspells: String,
    items: String,
    currency: String,
    notes: String,
    race: String,
    height: String,
    weight: String,
    streetcred: String,
    notoriety: String,
    publicawareness: String,
    karma: Int,
    totalkarma: Int,
    misc: String,
    body: Int,
    reaction: Int,
    logic: Int,
    edge: Int,
    edgepoints: Int,
    essence: Int,
    magicresonance: Int,
    matrixinitiative: Int,
    astralinitiative: Int,
    composure: Int,
    judgeintentions: Int,
    memory: Int,
    liftcarry: Int,
    skills: String,
    primarylifestyle: String,
    licenses: String,
    fakeidsetc: String,
    contacts: String,
    qualities: String,
    augmentations: String,
    cyberdeck: String,
    vehicle: String,
    other: String
  }
  type PlayerJoin {
    id: ID,
    gameId: ID,
    userId: ID
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
    Characters: [Character]
    followedplayer: [User]
    followedgame: [Game]
    followinguser: [User]
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
    id: ID,
    bio: String,
    userId: ID,
    User: User,
    pronouns: String,
    firstName: String,
    avatarUrl: String
  }
  type Language {
      id: ID,
      language: String
  }
  type Book {
      title: String,
      author: String,
      publisher: String,
      description: String
  }
  type GameType {
      id: ID,
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
    gameId: ID,
    title: String,
    description: String,
    details: String,
    deleted: Boolean,
    premium: Boolean,
    remote: Boolean,
    host: User,
    waitListOpen: Boolean,
    players: [User],
    spectators: [User],
    waitlist: [Waitlist],
    multipleApplications: Boolean,
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
    player: [User],
    Characters: [Character],
    Applications: [Application],
    blurb: String,
    spectatorChat: Boolean,
    hostId: ID
    updatedAt: String
    Messages: [Message]
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
    gameId: ID,
    messageText: String,
    createdAt: String,
    updatedAt: String,
    deleted: Boolean,
    reported: Boolean,
    spectatorChat: Boolean,
    MetaGameMessageType: MetaGameMessageType,
    User: User,
    sender: User
  }
  type MetaGameMessageType {
      id: ID
      metaGameMessageType: String
  }
  type Player {
    userId: ID,
    player: [User]
  }
  type Character {
    id: ID,
    name: String,
    imageUrl: String,
    bio: String,
    User: User,
    Game: Game,
    gameId: ID,
    characterSheetId: ID,
    retired: Boolean
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
    sendMessageToGame(gameId: ID, userId: ID, messageText: String, spectatorChat: Boolean, metaGameMessageTypeId: ID): CountAll
    editMessage(messageId: ID, userId: ID, editMessageText: String):CountAll
    deleteMessage(messageId: ID, userId: ID): CountAll
    sendNonGameMessages(userId: ID!, messageText: String!, conversationId: ID, metaGameMessageTypeId: ID): CountAll
    submitGame(userId: ID!, title: String!, blurb: String!, description: String!, gameTypeId: ID!, gameRulesetId: ID!, gameLanguageId: ID!): Game
    submitWaitlistApp(userId: ID!, charName: String!, charConcept: String!, whyJoin: String!, experience: String!, gameId: ID!): Game
    submitCharacterCreation(userId: ID, gameId: ID, bio: String, name: String, imageUrl: String): Character
    updateCharacter(characterId: ID, bio: String, imageUrl: String, name: String, characterSheetId: ID): Character
    updateBio(currentUserId: ID, userId: ID, bio: String, avatarUrl: String, pronouns: String, firstName: String): AboutMe
    updateGame(gameId: ID, userId: ID, title: String, blurb: String, details: String, waitListOpen: Boolean, deleted: Boolean, active: Boolean): Game
    changeEmail(userId: ID!, newEmail: String!, changeEmailPassword: String!): User
    changePassword(userId: ID!, newPassword: String!, oldPassword: String!): User
    joinWaitlist(hostId: ID, userId: ID, gameId: ID, whyJoin: String, charConcept: String, charName: String, experience: String): Application
    startNewNonGameConversation(currentUserId: ID, recipients: [String]): Conversation
    addRecipient(recipientName: String, conversationId: ID): Recipient
    approveApplication(applicationId: ID): [Application]
    ignoreApplication(applicationId: ID): [Application]
    declineOffer(applicationId: ID): Application
    acceptOffer(applicationId: ID, gameId: ID, userId: ID): Application
    createCharacterSheet(playerId: ID, name: String, characterClass: String): CharacterSheet
    editWaitlistApp(applicationId: ID, userId: ID, gameId: ID, whyJoin: String, charConcept: String, charName: String, experience: String): Application
    followGame(userId: ID, gameId: ID): Game
    unFollowGame(userId: ID, gameId: ID): CountAll
    followPlayer(currentUserId: ID, userId: ID): User
    unFollowPlayer(currentUserId: ID, userId: ID): User
    removePlayer(playerId: ID, gameId: ID, retireNote: String, userId: ID): [PlayerJoin]
    retireCharacter(characterId: ID, userId: ID, retireNote: String): Character
    registerUser(userName: String, email: String!, password: String!, confirmPassword: String!): AuthPayload!
    login(userName: String!, password: String!): AuthPayload!
  }
  type Subscription {
    messageSent(gameId: ID, conversationId: ID): CountAll
    spectatorMessageSent(gameId: ID, conversationId: ID): CountAll
  }
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

module.exports = typeDefs;
