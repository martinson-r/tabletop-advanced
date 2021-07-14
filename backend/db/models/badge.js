'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Badge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Badge.belongsToMany(models.User, {through: 'BadgeJoin', foreignKey: 'badgeId', otherKey: 'userId' });
    }
  };
  Badge.init({
    imageUrl: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Badge',
  });
  return Badge;
};
