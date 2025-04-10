'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('UserProfiles', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_userProfiles_userId',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserProfiles', 'fk_userProfiles_userId');
  }
};