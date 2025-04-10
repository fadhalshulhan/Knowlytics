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
          msg: "Nama kursus wajib diisi."
        },
        notNull: {
          msg: "Nama kursus tidak boleh kosong."
        }
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Deskripsi kursus wajib diisi"
        },
        notNull: {
          msg: "Deskripsi kursus tidak boleh kosong."
        }
      }
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Durasi kursus wajib diisi."
        },
        notNull: {
          msg: "Durasi kursus tidak boleh kosong."
        },
        isInt: {
          msg: "Durasi kursus harus berupa angka."
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};