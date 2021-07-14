'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GamePlayer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GamePlayer.belongsToMany(models.Game, {through: "GamePlayersJoin", foreignKey: "playerId", otherKey: "gameId"})
    }
  };
  GamePlayer.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GamePlayer',
  });
  return GamePlayer;
};
