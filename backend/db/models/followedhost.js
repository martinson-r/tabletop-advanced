'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FollowedHost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  FollowedHost.init({
    userId: DataTypes.INTEGER,
    hostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FollowedHost',
  });
  return FollowedHost;
};