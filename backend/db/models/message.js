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
      //Message.belongsToMany(models.User, { through: "Recipient", foreignKey: "messageId", otherKey: "userId"});
      Message.belongsTo(models.Conversation, { foreignKey: "conversationId" });

      //reportedBy needs work, probably needs to be a joins table.
      //A message can be reported by many users, and a user can report many messages.
    }
  };
  Message.init({
    messageText: DataTypes.STRING,
    metaGameMessageTypeId: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN,
    reported: DataTypes.BOOLEAN,

    //This needs to be a joins table.
    //Many users can report a message.
    //reportedBy: DataTypes.INTEGER,
    conversationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
