'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Messages', [{
      gameId: 1, senderId: 1, messageText: "Hello world"
     },
     {
      conversationId: 1, senderId: 1, messageText: "Howdy!"
     },
     {
      conversationId: 1, senderId: 2, messageText: "Heyo!"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Messages', null, {});
  }
};
