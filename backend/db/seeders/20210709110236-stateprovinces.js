'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('StateProvinces', [{
      //No... I didn't do them all.
      name: 'Alabama',
    },
    {
      name: 'Alaska',
    },
    {
      name: 'Arizona',
    },
    {
      name: 'Arkansas',
    },
    {
      name: 'California',
    },
    {
      name: 'Colorado',
    },
    {
      name: 'Connecticut',
    },
    {
      name: 'District of Columbia',
    },
    {
      name: 'Delaware',
    },
    {
      name: 'Florida',
    },{
      name: 'Georgia',
    },
    {
      name: 'Hawaii',
    },
    {
      name: 'Idaho',
    },
    {
      name: 'Illinois',
    },
    {
      name: 'Indiana',
    },
    {
      name: 'Iowa',
    },
    {
      name: 'Kansas',
    },
    {
      name: 'Kentucky',
    },
    {
      name: 'Louisiana',
    },
    {
      name: 'Maine',
    },
    {
      name: 'Maryland',
    },
    {
      name: 'Massachusetts',
    },
    {
      name: 'Michigan',
    },
    {
      name: 'Minnesota',
    },
    {
      name: 'Mississippi',
    },
    {
      name: 'Missouri',
    },
    {
      name: 'Montana',
    },
    {
      name: 'Nebraska',
    },
    {
      name: 'Nevada',
    },
    {
      name: 'New Hampshire',
    },
    {
      name: 'New Jersey',
    },
    {
      name: 'New Mexico',
    },
    {
      name: 'Ontario',
    },
    {
      name: 'Quebec',
    },
    {
      name: 'Nova Scotia',
    },
    {
      name: 'New Brunswick',
    },
    {
      name: 'Manitoba',
    },
    {
      name: 'British Colombia',
    },
    {
      name: 'Prince Edward Island',
    },
    {
      name: 'Saskatchewan',
    },
    {
      name: 'Alberta',
    },
    {
      name: 'Newfoundland and Labrador',
    },], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('StateProvinces', null, {});
  }
};
