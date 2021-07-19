'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Recipients', [{
      conversationId: 1,
      userId: 1,
      },
      {
        conversationId: 1,
        userId: 2,
        }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Recipients', null, {});
  }
};
