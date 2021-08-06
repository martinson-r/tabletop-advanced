'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn(
      'Messages',
      'messageText',
      {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Messages',
      'messageText',
      {
        type: Sequelize.STRING,
        allowNull: false,
      });
  }
};
