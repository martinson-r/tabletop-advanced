'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Games',
      'blurb',
      {
        type: Sequelize.STRING(255),
        allowNull: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Games', 'blurb');
  }
};
