'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.bulkInsert('Applications', [{
      whyJoin: "I love D&D", experience: "Some", charConcept:"Bardbardian", charName: "Boo boo"
     },
     {
      whyJoin: "Yay game!", experience: "Lots", charConcept:"Action Grandma", charName: "Mildred"
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Applications', null, {});
  }
};
