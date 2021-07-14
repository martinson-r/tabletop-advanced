'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AboutMe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //AboutMe.hasOne(models.User, {foreignKey: "userId"});
      AboutMe.belongsTo(models.Location, {foreignKey: "locationId"});
    }
  };
  AboutMe.init({
    userId: DataTypes.INTEGER,
    firstName: DataTypes.INTEGER,
    bio: DataTypes.TEXT,
    avatarUrl: DataTypes.STRING,
    homebrew: DataTypes.BOOLEAN,
    profanity: DataTypes.BOOLEAN,
    locationId: DataTypes.INTEGER,
    pronouns: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AboutMe',
  });
  return AboutMe;
};
