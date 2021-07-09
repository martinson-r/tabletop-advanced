'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stateProvinceId: {
        type: Sequelize.INTEGER,
        references: { model: "StateProvinces", key: "id" },
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: { model: "Countries", key: "id" },
      },
      timeZoneId: {
        type: Sequelize.INTEGER,
        references: { model: "TimeZones", key: "id" },
      },
      postalCode: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Locations');
  }
};
