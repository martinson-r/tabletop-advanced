'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.hasMany(models.Message, { foreignKey: "conversationId" });
    }
  };
  Conversation.init({
    gameId: DataTypes.INTEGER,
    conversationTypeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
