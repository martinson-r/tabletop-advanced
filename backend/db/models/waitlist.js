'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Waitlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Waitlist.init({
    gameId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    reviewed: DataTypes.BOOLEAN,
    ignored: DataTypes.BOOLEAN,
    isPlayer: DataTypes.BOOLEAN,
    // requestDate: DataTypes.DATE,
    hostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Waitlist',
  });
  return Waitlist;
};
