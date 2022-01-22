'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'CharacterSheets',
        'playerId',
         Sequelize.INTEGER
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'CharacterSheets',
        'playerId',
         Sequelize.INTEGER
       )
    ]);
  }
};
