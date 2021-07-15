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
      Conversation.belongsToMany(models.User, {through: "Recipients", as: "recipient", foreignKey: "conversationId", otherKey: "userId"});

      //rework the joins table, message data should be on the Conversation?
      Conversation.hasMany(models.Message, {foreignKey: "conversationId"});
    }
  };
  Conversation.init({

  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
