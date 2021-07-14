'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('Applications', [{
      userId: 1, whyJoin: "I love D&D", experience: "Some", charConcept:"Bardbardian", charName: "Boo boo"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Applications', null, {});
  }
};
