'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Lesson extends Model {
    static associate(models) {
      Lesson.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }
  Lesson.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "title is required."
        },
        notNull: {
          msg: "title is required."
        }
      }
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Content is required."
        },
        notNull: {
          msg: "Content is required."
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
    modelName: 'Lesson',
  });
  return Lesson;
};