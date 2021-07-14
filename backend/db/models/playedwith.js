'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlayedWith extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PlayedWith.init({
    userId: DataTypes.INTEGER,
    otherUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlayedWith',
  });
  return PlayedWith;
};