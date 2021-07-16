'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AboutMes', [{
      userId: 1,
      firstName: "Hana",
      pronouns: "she/her",
      bio: "I love this stuff",
      homebrew: true,
      houserules: true,
      profanity: true,
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AboutMes', null, {});
  }
};
