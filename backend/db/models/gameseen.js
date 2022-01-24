'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameSeen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameSeen.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    seen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'GameSeen',
  });
  return GameSeen;
};