'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('Users', [{
      email: 'actuallyacat@example.com',
      userName: 'ActuallyACat',
      emailVerified: true,
      hashedPassword: bcrypt.hashSync('password123', 10),
      isAdmin: false,
      hideStrangers: false
      },
      {
        email: 'thescarywizard@example.com',
        userName: 'TheScaryWizard',
        emailVerified: true,
        hashedPassword: bcrypt.hashSync('password123', 10),
        isAdmin: false,
        hideStrangers: false
      },
      {
        email: 'luckyfromflorida@example.com',
        userName: 'LuckyFromFlorida',
        emailVerified: true,
        hashedPassword: bcrypt.hashSync('password123', 10),
        isAdmin: false,
        hideStrangers: false
        }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
