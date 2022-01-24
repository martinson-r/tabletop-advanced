'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Recipients',
        'seen',
         Sequelize.BOOLEAN
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'Recipients',
        'seen',
         Sequelize.BOOLEAN
       )
    ]);
  }
};
