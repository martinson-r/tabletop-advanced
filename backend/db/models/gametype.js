'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameType.hasMany(models.Game, { foreignKey: "gameTypeId"});
      //GameType.belongsToMany(models.User, { through: "GameTypePreference", foreignKey: "gameTypeId", otherKey: "userId"});
    }
  };
  GameType.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameType',
  });
  return GameType;
};
