'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Characters', [{
     name: 'Lucky Kitty',
     bio: 'I\'m a cat!',
     imageUrl: 'https://placekitten.com/100/100',
     userId: 3,
     gameId: 1
    },
    {
      name: 'Scalesa',
      bio: 'Kind of a jerk.',
      imageUrl: 'https://i.imgur.com/L1qMEB9.png',
      userId: 2,
      gameId: 1
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Characters', null, {});
  }
};
