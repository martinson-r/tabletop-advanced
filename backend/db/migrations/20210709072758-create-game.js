'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Games', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      remote: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      public: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      locationId: {
        type: Sequelize.INTEGER,
        references: { model: "Locations", key: "id" },
      },
      gameSizeId: {
        type: Sequelize.INTEGER,
        references: { model: "GameSizes", key: "id" },
      },
      gameTypeId: {
        type: Sequelize.INTEGER,
        //They need to at LEAST say what type of game it is.
        allowNull: false,
        references: { model: "GameTypes", key: "id" },
      },
      gameFrequencyId: {
        type: Sequelize.INTEGER,
        references: { model: "GameFrequencies", key: "id" },
      },
      // blockedUsers: {
      //   type: Sequelize.INTEGER
      // },
      homebrew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      houserules: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      profanityOk: {
        type: Sequelize.BOOLEAN
      },
      gameCleanlinessId: {
        type: Sequelize.INTEGER,
        references: { model: "GameCleanlinesses", key: "id" },
      },
      guestHostId: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
      },
      hostId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Languages", key: "id" },
      },
      ruleSetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Rulesets", key: "id" },
      },
      gameTimeId: {
        //Allowed to be null because Play By Post games may not have a time.
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
    await queryInterface.dropTable('Games');
  }
};
