'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StateProvince extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StateProvince.hasMany(models.Location, { foreignKey: "stateProvinceId" });
    }
  };
  StateProvince.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StateProvince',
  });
  return StateProvince;
};
