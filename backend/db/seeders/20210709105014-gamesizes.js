'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameSizes', [{
     size: "Single Player"
    },
    {
      size: "2-3 Players"
     },
     {
      size: "3-5 Players"
     },
     {
      size: "6+ Players"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameSizes', null, {});
  }
};
