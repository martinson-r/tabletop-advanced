'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('GameTimes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      //Times are allowed to be null because Play By Post games may not have times.
      startHour: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 12
        }
      },
      endHour: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 12
        },
      },
      startMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 60
        }
      },
      endMinutes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 60
        }
      },
      timeZoneId: {
        type: Sequelize.INTEGER,
        references: { model: "TimeZones", key: "id" },
      },
      am: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GameTimes');
  }
};
