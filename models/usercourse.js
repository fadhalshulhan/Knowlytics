'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    static associate(models) {
      UserCourse.belongsTo(models.User, { foreignKey: 'userId' });
      UserCourse.belongsTo(models.Course, { foreignKey: 'courseId' });
    }
  }
  UserCourse.init({
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
    },

    stripePaymentId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    }

  }, {
    sequelize,
    modelName: 'UserCourse',
  });
  return UserCourse;
};