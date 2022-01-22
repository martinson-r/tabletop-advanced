'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Games',
        'genreId',
         Sequelize.INTEGER
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'Games',
        'genreId',
         Sequelize.INTEGER
       )
    ]);
  }
};
