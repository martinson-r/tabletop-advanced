'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('Messages', 'metaGameMessageTypeId', {
        type: Sequelize.INTEGER,
        references: { model: "MetaGameMessageTypes", key: "id" },
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([queryInterface.changeColumn('Messages', 'metaGameMessageTypeId'), {
      type: Sequelize.INTEGER,
    }]);
  },
};
