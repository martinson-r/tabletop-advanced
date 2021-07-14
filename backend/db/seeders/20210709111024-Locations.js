'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Locations', [{
      stateProvinceId: 5,
      countryId: 3,
      timeZoneId: 2,
      postalCode: '90210'
      },
      {
        stateProvinceId: null,
        countryId: 1,
        timeZoneId: 5,
        postalCode: '541000'
        },
        {
          stateProvinceId: null,
          countryId: 2,
          timeZoneId: 6,
          postalCode: '110001'
          }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Locations', null, {});
  }
};
