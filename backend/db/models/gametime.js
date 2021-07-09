'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GameTime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GameTime.belongsTo(models.AmPm, {foreignKey: "amPmId"});
      GameTime.belongsTo(models.TimeZone, {foreignKey: "timeZoneId"});
      GameTime.hasMany(models.Game, { foreignKey: "gameTimeId"});
    }
  };
  GameTime.init({
    startHour: DataTypes.INTEGER,
    endHour: DataTypes.INTEGER,
    startMinutes: DataTypes.INTEGER,
    endMinutes: DataTypes.INTEGER,
    timeZoneId: DataTypes.INTEGER,
    amPmId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'GameTime',
  });
  return GameTime;
};
