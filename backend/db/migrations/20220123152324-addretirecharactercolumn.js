module.exports = {
  up: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Characters',
        'retired',
         Sequelize.BOOLEAN
       )
    ],
    [
      queryInterface.addColumn(
        'Characters',
        'retiredNote',
         Sequelize.STRING
       )
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(
        'Characters',
        'retired',
         Sequelize.BOOLEAN
       )
    ],
    [
      queryInterface.removeColumn(
        'Characters',
        'retiredNote',
         Sequelize.STRING
       )
    ]);
  }
};
