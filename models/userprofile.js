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
          msg: 'ID pengguna wajib diisi.'
        },
        notNull: {
          msg: 'ID pengguna harus berupa angka.'
        },
      }
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nama lengkap wajib diisi.'
        },
        notNull: {
          msg: 'Nama lengkap tidak boleh kosong.'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Nomor telepon wajib diisi.' },
        notNull: { msg: 'Nomor telepon tidak boleh kosong.' },
        len: { args: [10, 15], msg: 'Nomor telepon harus terdiri dari 10-15 karakter.' },
        isValidPhone(value) {
          if (!/^\+?[0-9]{10,15}$/.test(value)) {
            throw new Error('Nomor telepon hanya boleh berisi angka dan tanda ' + ' di awal (opsional).');
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