'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Editions', [{
      edition: '5th'
      },
      {
        edition: '2nd'
        },
        {
          edition: '3.0'
          },
          {
            edition: '3.5'
            },
            {
              edition: '1st'
              },
            {
              edition: 'N/A'
              },], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Editions', null, {});
  }
};
