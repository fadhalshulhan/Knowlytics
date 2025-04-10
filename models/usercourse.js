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
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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