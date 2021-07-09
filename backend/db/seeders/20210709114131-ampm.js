'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //Seriously... refactor and do this with a boolean!
    await queryInterface.bulkInsert('AmPms', [{
      ampm: 'AM'
     },
     {
      ampm: 'PM'
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AmPms', null, {});
  }
};
