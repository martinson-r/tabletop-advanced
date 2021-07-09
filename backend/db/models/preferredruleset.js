'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PreferredRuleset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PreferredRuleset.init({
    userId: DataTypes.INTEGER,
    rulesetId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PreferredRuleset',
  });
  return PreferredRuleset;
};