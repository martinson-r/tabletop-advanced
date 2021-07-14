'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameCleanliness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameCleanliness.hasMany(models.Game, {foreignKey: "gameCleanlinessId"});
      //GameCleanliness.belongsToMany(models.User, {through: 'GameCleanlinessPreferences', foreignKey: 'gameCleanlinessId', otherKey: 'userId' });
    }
  };
  GameCleanliness.init({
    cleanliness: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameCleanliness',
  });
  return GameCleanliness;
};
