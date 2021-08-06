'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Waitlists', [{
      gameId: 1,
      userId: 4,
      applicationId: 2,
      hostId: 1
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Waitlists', null, {});
  }
};
