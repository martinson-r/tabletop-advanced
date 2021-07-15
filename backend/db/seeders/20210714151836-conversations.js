'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Conversations', [{
id: 1
},
{
  id: 2
  }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Conversations', null, {});
  }
};
