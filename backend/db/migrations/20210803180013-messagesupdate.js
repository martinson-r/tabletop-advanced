'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Messages',
      'spectatorChat',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Messages', 'spectatorChat');
  }
};
