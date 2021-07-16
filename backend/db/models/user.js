'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Aliased, to make life easier
      User.belongsToMany(models.Game, { through: 'PlayerJoins', as: "player", foreignKey: 'userId', otherKey: 'gameId' });
      // User.belongsToMany(models.Game, {as: "GameModerator", through: 'Moderator', foreignKey: 'userId', otherKey: 'gameId' });
      // User.belongsToMany(models.Game, {as: "GameSpectator", through: 'Spectator', foreignKey: 'userId', otherKey: 'gameId' });
      User.hasMany(models.Game, { as: "host", foreignKey: 'hostId' });
      User.hasMany(models.Message, { as: "sender", foreignKey: "senderId" });
      //User.hasMany(models.Application, {as: "applicant", foreignKey: "userId"});

      //Can't associate to applications again.
      User.belongsToMany(models.Application, { through: "Waitlists", as: "applicationOwner", foreignKey: "userId", otherKey: "applicationId"});
      User.belongsToMany(models.Game, { through: "Waitlists", as: "applicant", foreignKey: "userId", otherKey: "gameId"});
      User.hasMany(models.AboutMe, { foreignKey: "userId"});
      User.belongsToMany(models.Conversation, {through: "Recipients", as: "recipient", foreignKey: "userId", otherKey: "conversationId"});

      //TODO Refactor: Blocked Users in Games should go on a joins table

      //Self joining association
      //User.belongsToMany(models.User, {as: "BlockingUser", through: 'BlockedPlayer', foreignKey: 'userId', otherKey: 'otherUserId' });
      //User.belongsToMany(models.User, {as: "BlockedUser", through: 'BlockedPlayer', foreignKey: 'otherUserId', otherKey: 'userId' });

      // User.belongsToMany(models.GameDay, {through: 'GameDaysPreferences', foreignKey: 'userId', otherKey: 'gameDayId' });
      // User.belongsToMany(models.GameFrequency, {through: 'GameFrequencyPreferences', foreignKey: 'userId', otherKey: 'gameFrequencyId' });
      // User.belongsToMany(models.GameCleanliness, {through: 'GameCleanlinessPreferences', foreignKey: 'userId', otherKey: 'gameCleanlinessId' });
      // User.belongsToMany(models.Badge, {through: 'BadgeJoin', foreignKey: 'usereId', otherKey: 'badgeId' });
      // User.belongsToMany(models.GameType, { through: "GameTypePreference", foreignKey: "userId", otherKey: "gameTypeId"});
      // User.belongsToMany(models.Book, { through: "PreferredBook", foreignKey: "userId", otherKey: "bookId"});
      // User.belongsToMany(models.Ruleset, { through: "PreferredRuleset", foreignKey: "userId", otherKey: "rulesetId"});
      // User.belongsToMany(models.Language, { through: "PreferredLanguage", foreignKey: "userId", otherKey: "languageId"});
      //User.belongsToMany(models.Message, { through: "Recipient", foreignKey: "userId", otherKey: "messageId"});
    }
  };
  User.init({
    isAdmin: DataTypes.BOOLEAN,
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true,
          },
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
        validate: {
          len: [60, 60]
        }
    },
    lastOnline: DataTypes.DATE,
    emailVerified: DataTypes.BOOLEAN,
    hideStrangers: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
