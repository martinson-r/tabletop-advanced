'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('TimeZones', [{
    timeZone: "Eastern"
    },
    {
      timeZone: "Pacific"
      },
      {
        timeZone: "Mountain"
        },
        {
          timeZone: "Central"
          },
          {
            timeZone: "China Standard"
            },
            {
              timeZone: "India Standard"
              }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('TimeZones', null, {});
  }
};
