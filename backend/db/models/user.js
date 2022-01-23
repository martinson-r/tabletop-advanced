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
      User.hasMany(models.Game, { as: "host", foreignKey: 'hostId' });
      User.hasMany(models.Character, { foreignKey: 'userId'});
      User.hasMany(models.Message, { as: "sender", foreignKey: "senderId" });
      User.hasMany(models.AboutMe, { foreignKey: "userId"});

      //Can't associate to applications again.
      User.belongsToMany(models.Application, { through: "Waitlists", as: "applicationOwner", foreignKey: "userId", otherKey: "applicationId" });
      User.belongsToMany(models.Application, {as: "gameHost", through: "Waitlists", foreignKey: "userId", otherKey: "applicationId" });
      User.belongsToMany(models.Game, { through: "Waitlists", as: "applicant", foreignKey: "userId", otherKey: "gameId"});
      User.belongsToMany(models.Game, { through: "PlayerJoins", as: "gamePlayed", foreignKey: 'userId', otherKey: 'gameId' });
      User.belongsToMany(models.Conversation, {through: "Recipients", as: "recipient", foreignKey: "userId", otherKey: "conversationId" });

      User.belongsToMany(models.Game, { through: "FollowedGames", as: "followedgame", foreignKey: "userId", otherKey: "gameId"});
      User.belongsToMany(models.User, { through: "FollowedPlayers", as: "followedplayer", foreignKey: "userId", otherKey: "playerId" });
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
