'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('People', [{
     name: 'Lucky Kitty',
     bio: 'I\'m a cat!',
     imageUrl: 'https://placekitten.com/100/100',
     userId: 3,
     gameId: 1
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
