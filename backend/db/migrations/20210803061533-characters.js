'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Characters',
      'userId',
      Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'Characters',
      'gameId',
      Sequelize.INTEGER
    ),
    queryInterface.addColumn(
      'Characters',
      'characterSheetId',
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Characters',
      'userId',
      Sequelize.INTEGER
    ),
    queryInterface.removeColumn(
      'Characters',
      'gameId',
      Sequelize.INTEGER
    ),
    queryInterface.removeColumn(
      'Characters',
      'characterSheetId',
      Sequelize.INTEGER
    );
  }
};
