'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Game.belongsToMany(models.User, {as: "UserModerator", through: 'Moderator', foreignKey: 'gameId', otherKey: 'userId' });
      Game.belongsToMany(models.Application, {through: "Waitlists", foreignKey: 'gameId', otherKey: 'applicationId'});
      Game.belongsTo(models.GameType, {foreignKey: "gameTypeId"});
      // Game.belongsTo(models.GameSize, {foreignKey: "gameSizeId"});
      // Game.belongsTo(models.GameFrequency, {foreignKey: "gameFrequencyId"});
      // Game.belongsTo(models.GameCleanliness, {foreignKey: "gameCleanlinessId"});

      //TODO Refactor: Blocked Users in Games should go on a joins table

       Game.belongsTo(models.User, { as: "host", foreignKey: 'hostId'});
      //Game.belongsTo(models.User, {as: "GuestHost", foreignKey: "guestHostId"});
      // Game.belongsTo(models.Ruleset, {foreignKey: "ruleSetId"});
      Game.belongsTo(models.Language, {foreignKey: "languageId"});
      // Game.belongsTo(models.GameTime, {foreignKey: "gameTimeId"});
      // Game.belongsTo(models.GameFrequency, {foreignKey: "gameFrequencyId"});
      // Game.belongsTo(models.GameSize, {foreignKey: "gameSizeId"});
      // Game.belongsToMany(models.Book, {through: 'BookList', foreignKey: 'gameId', otherKey: 'bookId' });
      // Game.belongsToMany(models.GameDay, {through: 'GameDaysJoins', foreignKey: 'gameId', otherKey: 'gameDayId' });
      Game.belongsToMany(models.User, { through: "PlayerJoins", as: "player", foreignKey: "gameId", otherKey: "userId"});
      Game.belongsToMany(models.User, { through: "Waitlists", as: "applicant", foreignKey: "gameId", otherKey: "userId"})
    }
  };
  Game.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    remote: DataTypes.BOOLEAN,
    public: DataTypes.BOOLEAN,
    premium: DataTypes.BOOLEAN,
    active: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    waitListOpen: DataTypes.BOOLEAN,
    allowPlayerEdits: DataTypes.BOOLEAN,
    allowPlayerDeletes: DataTypes.BOOLEAN,
    locationId: DataTypes.INTEGER,
    gameSizeId: DataTypes.INTEGER,
    gameTypeId: DataTypes.INTEGER,
    gameTimeId: DataTypes.INTEGER,
    gameFrequencyId: DataTypes.INTEGER,
    //Figure this one out. Might need to be a joins table.
    //blockedUsers: DataTypes.INTEGER,
    homebrew: DataTypes.BOOLEAN,
    houserules: DataTypes.BOOLEAN,
    profanityOk: DataTypes.BOOLEAN,
    gameCleanlinessId: DataTypes.INTEGER,
    guestHostId: DataTypes.INTEGER,
    hostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    languageId: DataTypes.INTEGER,
    ruleSetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Game',
  });
  return Game;
};
