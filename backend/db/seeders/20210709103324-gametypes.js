'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameTypes', [{
      type: 'Live Chat'
      },
    {
      type: 'Play By Post'
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameTypes', null, {});
  }
};
