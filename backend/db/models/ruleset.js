'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ruleset extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Ruleset.belongsToMany(models.User, { through: "PreferredRuleset", foreignKey: "rulesetId", otherKey: "userId"});
    }
  };
  Ruleset.init({
    ruleset: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ruleset',
  });
  return Ruleset;
};
