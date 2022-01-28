'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Genres', [{
     name: 'Fantasy',
     updatedAt: new Date(),
     createdAt: new Date()
    },
    {
      name: 'Science Fiction',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Horror',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Cyberpunk',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Urban Fantasy',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Superhero',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Western',
      updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Anime',
    updatedAt: new Date(),
     createdAt: new Date()
     },
     {
      name: 'Mecha',
    updatedAt: new Date(),
     createdAt: new Date()
     },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Genres', null, {});
  }
};
