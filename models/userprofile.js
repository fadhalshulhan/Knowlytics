'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    static associate(models) {
      UserProfile.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  UserProfile.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'User ID cannot be empty'
        },
        notNull: {
          msg: 'User ID is required'
        },
        isInt: {
          msg: "Number only."
        }
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Full name cannot be empty'
        },
        notNull: {
          msg: 'Full name is required'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Phone number cannot be empty' },
        notNull: { msg: 'Phone number is required' },
        len: { args: [10, 15], msg: 'Phone number must be between 10 and 15 characters' },
        isValidPhone(value) {
          if (!/^\+?[0-9]{10,15}$/.test(value)) {
            throw new Error('Phone number must contain only digits and an optional leading "+"');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'UserProfile'
  });
  return UserProfile;
};