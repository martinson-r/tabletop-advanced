'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameDaysPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameDaysPreference.init({
    userId: DataTypes.INTEGER,
    gameDayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameDaysPreference',
  });
  return GameDaysPreference;
};