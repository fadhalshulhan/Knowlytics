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
          result.error = { type: 'email', message: 'Email wajib diisi.' };
          return result;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          result.error = { type: 'email', message: 'Masukkan alamat email yang valid.' };
          return result;
        }

        // Validasi password
        if (!password) {
          result.error = { type: 'password', message: 'Kata sandi wajib diisi.' };
          return result;
        }
        if (password.length < 8) {
          result.error = { type: 'password', message: 'Kata sandi harus minimal 8 karakter.' };
          return result;
        }

        // Cek email di database
        const user = await this.findOne({ where: { email } });
        if (!user) {
          result.error = { type: 'email', message: 'Email belum terdaftar.' };
          return result;
        }

        // Cek kecocokan password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          result.error = { type: 'password', message: 'Kata sandi salah.' };
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
        notNull: { msg: 'Nama pengguna wajib diisi.' },
        notEmpty: { msg: 'Nama pengguna tidak boleh kosong.' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Email ini sudah terdaftar.' },
      validate: {
        notNull: { msg: 'Email wajib diisi.' },
        notEmpty: { msg: 'Email tidak boleh kosong.' },
        isEmail: { msg: 'Masukkan alamat email yang valid.' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Kata sandi wajib diisi.' },
        notEmpty: { msg: 'Kata sandi tidak boleh kosong.' },
        len: { args: [8, Infinity], msg: 'Kata sandi minimal 8 karakter.' }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Peran wajib diisi' },
        notEmpty: { msg: 'Peran tidak boleh kosong' },
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