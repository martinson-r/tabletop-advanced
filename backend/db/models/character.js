'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Character extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Character.belongsToMany(models.Game, { through: "PlayerJoins", foreignKey: "characterId", otherKey: "gameId"});
    Character.belongsTo(models.User, { foreignKey: 'userId'});
    Character.belongsTo(models.Game, { foreignKey: 'gameId'});
    }
  };
  Character.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    //TODO:
    characterSheetId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    bio: DataTypes.TEXT,
    imageUrl: DataTypes.STRING,
    retired: DataTypes.BOOLEAN,
    retiredNote: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Character',
  });
  return Character;
};
