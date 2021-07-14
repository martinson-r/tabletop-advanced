'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Location.belongsTo(models.StateProvince, { foreignKey: "stateProvinceId" });
    }
  };
  Location.init({
    stateProvinceId: DataTypes.INTEGER,
    countryId: DataTypes.INTEGER,
    timeZoneId: DataTypes.INTEGER,
    postalCode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Location',
  });
  return Location;
};
