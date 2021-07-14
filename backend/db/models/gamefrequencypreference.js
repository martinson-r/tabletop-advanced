'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameFrequencyPreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameFrequencyPreference.init({
    userId: DataTypes.INTEGER,
    gameFrequencyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameFrequencyPreference',
  });
  return GameFrequencyPreference;
};