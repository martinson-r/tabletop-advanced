'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('PlayerJoins', [{
     gameId: 1,
    userId: 2 },
    {
      gameId: 1,
     userId: 3 }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('PlayerJoins', null, {});
  }
};
