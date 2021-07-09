'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameDaysJoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameDaysJoin.init({
    gameId: DataTypes.INTEGER,
    gameDayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameDaysJoin',
  });
  return GameDaysJoin;
};