'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Waitlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Games", key: "id" },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      applicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Applications", key: "id" },
      },
      reviewed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      ignored: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isPlayer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      // requestDate: {
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.fn('now'),
      // },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
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
    await queryInterface.dropTable('Waitlists');
  }
};
