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
      validate: {
        notEmpty: {
          msg: "userId is required."
        },
        notNull: {
          msg: "userId is required."
        },
        isInt: {
          msg: "Number only."
        }
      }
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "courseId is required."
        },
        notNull: {
          msg: "courseId is required."
        },
        isInt: {
          msg: "Number only."
        }
      }
    }

  }, {
    sequelize,
    modelName: 'CourseCategory',
  });
  return CourseCategory;
};