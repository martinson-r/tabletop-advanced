'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeZone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TimeZone.hasMany(models.GameTime, {foreignKey: "timeZoneId"});
    }
  };
  TimeZone.init({
    timeZone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TimeZone',
  });
  return TimeZone;
};
