'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'FollowedGames',
        'visited',
         Sequelize.DATE
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'FollowedGames',
        'visited',
         Sequelize.DATE
       )
    ]);
  }
};
