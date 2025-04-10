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
          msg: "Judul pelajaran wajib diisi."
        },
        notNull: {
          msg: "Judul pelajaran tidak boleh kosong."
        }
      }
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Konten pelajaran wajib diisi."
        },
        notNull: {
          msg: "Konten pelajaran tidak boleh kosong."
        }
      }
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {
    sequelize,
    modelName: 'Lesson',
  });
  return Lesson;
};