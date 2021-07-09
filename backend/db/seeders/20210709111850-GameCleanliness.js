'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameCleanlinesses', [{
      cleanliness: "Anything goes"
       },
       {
        cleanliness: "Mature Content"
         },
         {
          cleanliness: "PG-13"
           },
           {
            cleanliness: "Squeaky clean"
             }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameCleanlinesses', null, {});
  }
};
