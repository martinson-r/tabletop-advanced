'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommunityStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CommunityStatus.init({
    userId: DataTypes.INTEGER,
    gamesHosted: DataTypes.INTEGER,
    gamesPlayed: DataTypes.INTEGER,
    reactionsGiven: DataTypes.INTEGER,
    reactionsReceived: DataTypes.INTEGER,
    sessionsPlayed: DataTypes.INTEGER,
    hostPoints: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CommunityStatus',
  });
  return CommunityStatus;
};