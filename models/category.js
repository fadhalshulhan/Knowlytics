'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Course, { through: models.CourseCategory, foreignKey: 'categoryId' });
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "name is required."
        },
        notNull: {
          msg: "name is required."
        },
      }
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};