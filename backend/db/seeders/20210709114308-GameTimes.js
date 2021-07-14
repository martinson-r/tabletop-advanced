'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // startHour: DataTypes.INTEGER,
    // endHour: DataTypes.INTEGER,
    // startMinutes: DataTypes.INTEGER,
    // endMinutes: DataTypes.INTEGER,
    // timeZoneId: DataTypes.INTEGER,
    // amPmId: DataTypes.INTEGER,

    await queryInterface.bulkInsert('GameTimes', [{
      startHour: 11,
      endHour: 12,
      startMinutes: 30,
      endMinutes: 0,
      timeZoneId: 2,
      am: true,
      },
      {
        startHour: 3,
        endHour: 4,
        startMinutes: 0,
        endMinutes: 15,
        timeZoneId: 3,
        am: true,
        }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameTimes', null, {});
  }
};
