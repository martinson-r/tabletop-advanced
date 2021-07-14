'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameTypePreference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  GameTypePreference.init({
    userId: DataTypes.INTEGER,
    gameTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GameTypePreference',
  });
  return GameTypePreference;
};