'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Books', [{
    rulesetId: 1,
    editionId: 1,
    title: "Player's Handbook",
    author: "various",
    description: "Dungeons & Dragons Core Rulebook",
    imageUrl: null,
    buyUrl: null,
    publisher: "Wizards of the Coast"
      },
      {
        rulesetId: 2,
        editionId: 5,
        title: "Core Rulebook",
        author: "Jason Bulmahn",
        description: "Pathfinder Core Rulebook",
        imageUrl: null,
        buyUrl: null,
        publisher: "Paizo"
          }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', null, {});
  }
};
