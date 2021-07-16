'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Application extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Application.belongsTo(models.Game, {foreignKey: 'gameId' });
      Application.belongsTo(models.User, {as: "applicant", foreignKey: "userId"});
      Application.belongsTo(models.User, {as: "host", foreignKey: "hostId"});
    }
  };
  Application.init({
    userId: DataTypes.INTEGER,
    hostId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    whyJoin: DataTypes.TEXT,
    charName: DataTypes.STRING,
    charConcept: DataTypes.TEXT,
    experience: DataTypes.TEXT,
    ignored: DataTypes.BOOLEAN,
    accepted: DataTypes.BOOLEAN,
    isPlayer: DataTypes.BOOLEAN,
    // requestDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Application',
  });
  return Application;
};
