'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameSize extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameSize.hasMany(models.Game, {foreignKey: "gameSizeId"});
    }
  };
  GameSize.init({
    size: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameSize',
  });
  return GameSize;
};
