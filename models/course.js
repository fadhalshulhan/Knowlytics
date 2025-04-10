'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsToMany(models.User, { through: models.UserCourse, foreignKey: 'courseId' });
      Course.belongsToMany(models.Category, { through: models.CourseCategory, foreignKey: 'courseId' });
      Course.hasMany(models.Lesson, { foreignKey: 'courseId' });
    }


    async getLessonCount() {
      const lessons = await this.getLessons();
      return lessons.length;
    }

    get courseInfo() {
      return `${this.duration} hari`;
    }

    static async getCoursesWithCategories() {
      return this.findAll({
        include: [{ model: sequelize.models.Category, through: { attributes: [] } }]
      });
    }
  }

  Course.init({
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is required."
        },
        notNull: {
          msg: "Name is required."
        }
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is required."
        },
        notNull: {
          msg: "Description is required."
        }
      }
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Duration is required."
        },
        notNull: {
          msg: "Duration is required."
        },
        isInt: {
          msg: "Number only."
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};