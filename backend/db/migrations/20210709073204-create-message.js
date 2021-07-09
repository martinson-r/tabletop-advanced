'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      messageText: {
        allowNull: false,
        type: Sequelize.STRING
      },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      reported: {
        type: Sequelize.BOOLEAN
      },
      // reportedBy: {
      //   type: Sequelize.INTEGER
      // },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      gameId: {
        type: Sequelize.INTEGER,
        references: { model: "Games", key: "id" },
      },
      metaGameMessageTypeId: {
        type: Sequelize.INTEGER,
      },
      conversationTypeId: {
        type: Sequelize.INTEGER,
        references: { model: "ConversationTypes", key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Messages');
  }
};
