'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameDays', [{
      day: 'Monday'
      },
      {
        day: 'Tuesay'
        },
        {
          day: 'Wednesday'
          },
          {
            day: 'Thursday'
            },
            {
              day: 'Friday'
              },
              {
                day: 'Saturday'
                },
                {
                  day: 'Sunday'
                  },], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameDays', null, {});
  }
};
