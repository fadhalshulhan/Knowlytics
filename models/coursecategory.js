'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CourseCategory extends Model {
    static associate(models) {
      CourseCategory.belongsTo(models.Course, { foreignKey: 'courseId' });
      CourseCategory.belongsTo(models.Category, { foreignKey: 'categoryId' });
    }
  }
  CourseCategory.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'CourseCategory',
  });
  return CourseCategory;
};