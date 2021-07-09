'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Book.belongsToMany(models.User, {through: "PreferredBook", foreignKey: "bookId", otherKey: "userId"})
    }
  };
  Book.init({
    rulesetId: DataTypes.INTEGER,
    editionId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    buyUrl: DataTypes.STRING,
    publisher: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};
