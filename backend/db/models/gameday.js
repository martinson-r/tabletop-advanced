'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //GameDay.belongsToMany(models.User, {through: 'GameDaysPreferences', foreignKey: 'gameDayId', otherKey: 'userId' });
      //GameDay.belongsToMany(models.User, {through: 'GameDaysJoins', foreignKey: 'gameDayId', otherKey: 'gameId' });
    }
  };
  GameDay.init({
    day: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GameDay',
  });
  return GameDay;
};
