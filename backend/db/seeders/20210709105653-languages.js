'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Languages', [{
      language: 'English',
    },
    {
      language: 'Spanish',
    },
    {
      language: 'Portuguese',
    },
    {
      language: 'Mandarin Chinese',
    },
    {
      language: 'German',
    },
    {
      language: 'Hindi',
    },
    {
      language: 'Arabic',
    },
    {
      language: 'Russian',
    },
    {
      language: 'Japanese',
    },
    {
      language: 'French',
    },
    {
      language: 'Indonesian',
    },
    {
      language: 'Indonesian',
    },
    {
      language: 'Urdu',
    },
    {
      language: 'Swahili',
    },
    {
      language: 'Marathi',
    },
    {
      language: 'Other',
    },], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Languages', null, {});
  }
};
