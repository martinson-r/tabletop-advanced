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
      //TODO: this will be stuff like DM requests, dice rolls, etc?
      // messageTypeId: {
      //   type: Sequelize.INTEGER,
      //   references: { model: "MessageTypes", key: "id" },
      // },
      deleted: {
        type: Sequelize.BOOLEAN
      },
      reported: {
        type: Sequelize.BOOLEAN
      },
      // reportedBy: {
      //   type: Sequelize.INTEGER
      // },
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Conversations", key: "id" },
      },
      metaGameMessageTypeId: {
        type: Sequelize.INTEGER,
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
