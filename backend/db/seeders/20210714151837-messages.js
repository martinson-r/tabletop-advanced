'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages', [{
      gameId: 1, userId: 1, messageText: "Hello world"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
