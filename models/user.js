'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.UserProfile, { foreignKey: 'userId' });
      User.belongsToMany(models.Course, { through: models.UserCourse, foreignKey: 'userId' });
    }

    async getFullName() {
      const profile = await this.getUserProfile();
      return profile ? profile.fullName : null;
    }

    static async validateLogin(email, password) {
      const result = { success: false, user: null, error: null };

      try {
        // Validasi email
        if (!email) {
          result.error = { type: 'email', message: 'Email is required' };
          return result;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          result.error = { type: 'email', message: 'Please enter a valid email address' };
          return result;
        }

        // Validasi password
        if (!password) {
          result.error = { type: 'password', message: 'Password is required' };
          return result;
        }
        if (password.length < 8) {
          result.error = { type: 'password', message: 'Password must be at least 8 characters long' };
          return result;
        }

        // Cek email di database
        const user = await this.findOne({ where: { email } });
        if (!user) {
          result.error = { type: 'email', message: 'Email not registered' };
          return result;
        }

        // Cek kecocokan password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          result.error = { type: 'password', message: 'Invalid password' };
          return result;
        }

        // Jika semua validasi berhasil
        result.success = true;
        result.user = user;
        return result;
      } catch (error) {
        result.error = { type: 'general', message: error.message };
        return result;
      }
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false, // Changed from true to false to enforce requirement
      validate: {
        notNull: { msg: 'Username is required' },
        notEmpty: { msg: 'Username cannot be empty' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'This email is already registered' },
      validate: {
        notNull: { msg: 'Email is required' },
        notEmpty: { msg: 'Email cannot be empty' },
        isEmail: { msg: 'Please enter a valid email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Password is required' },
        notEmpty: { msg: 'Password cannot be empty' },
        len: { args: [8, Infinity], msg: 'Password must be at least 8 characters long' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Role is required' },
        notEmpty: { msg: 'Role cannot be empty' },
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  });
  return User;
};