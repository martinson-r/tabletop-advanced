'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameFrequencies', [{
     frequency: "Daily"
    },
    {
      frequency: "1x/Week"
     },
     {
      frequency: "2x/Week"
     },
     {
      frequency: "3x/Week"
     },
     {
      frequency: "4x/Week"
     },
     {
      frequency: "5x/Week"
     },
     {
      frequency: "6x/Week"
     },
     {
      frequency: "Bi-Weekly"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameFrequencies', null, {});
  }
};
