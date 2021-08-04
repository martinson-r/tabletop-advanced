'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });
      Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId" });
      //Message.belongsTo(models.User, { as: "sender", foreignKey: "senderId"});
    }
  };
  Message.init({
    messageText: DataTypes.STRING,
    metaGameMessageTypeId: DataTypes.INTEGER,
    conversationTypeId: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER,
    spectatorChat: DataTypes.BOOLEAN,
    gameId: DataTypes.INTEGER,
    senderId: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN,
    reported: DataTypes.BOOLEAN,

    //reportedBy needs work, probably needs to be a joins table.
      //A message can be reported by many users, and a user can report many messages.
    //reportedBy: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
