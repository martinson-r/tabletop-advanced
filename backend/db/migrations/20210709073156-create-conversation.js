'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        //This can be null. It may not be associatd with a game.
        type: Sequelize.INTEGER,
        references: { model: "Games", key: "id" },
      },
      conversationTypeId: {
        type: Sequelize.INTEGER,
        //This can't be null. We do need to know if it's Spectator, Private, or Game.
        allowNull: false,
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
    await queryInterface.dropTable('Conversations');
  }
};
