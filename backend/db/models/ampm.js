'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AmPm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AmPm.hasMany(models.GameTime, {foreignKey:"amPmId"});
    }
  };
  AmPm.init({
    ampm: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AmPm',
  });
  return AmPm;
};
