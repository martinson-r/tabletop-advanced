'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameFrequency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameFrequency.belongsToMany(models.User, {through: 'GameFrequencyPreferences', foreignKey: 'gameFrequencyId', otherKey: 'userId' });
      GameFrequency.hasMany(models.Game, {foreignKey: "gameFrequencyId"});
    }
  };
  GameFrequency.init({
    frequency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameFrequency',
  });
  return GameFrequency;
};
