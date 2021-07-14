'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Countries', [{
      //Based on 10 most populous countries in 2021
      name: "China" },
      {
        name: "India" },
        {
          name: "Pakistan" },
          {
            name: "United States" },
            {
              name: "Indonesia" },
              {
                name: "Brazil" },
                {
                  name: "Nigeria" },
                  {
                    name: "Russia" },
                    {
                      name: "Bangladesh" },
                      {
                        name: "Mexico" }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Countries', null, {});
  }
};
