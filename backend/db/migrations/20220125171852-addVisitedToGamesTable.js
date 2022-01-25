'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Games',
        'visited',
         Sequelize.DATE
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'Games',
        'visited',
         Sequelize.DATE
       )
    ]);
  }
};
