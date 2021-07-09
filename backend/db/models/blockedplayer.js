'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockedPlayer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BlockedPlayer.init({
    userIdThis: DataTypes.INTEGER,
    otherUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BlockedPlayer',
  });
  return BlockedPlayer;
};
