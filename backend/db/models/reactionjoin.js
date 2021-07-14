'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReactionJoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ReactionJoin.init({
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    reactionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ReactionJoin',
  });
  return ReactionJoin;
};
