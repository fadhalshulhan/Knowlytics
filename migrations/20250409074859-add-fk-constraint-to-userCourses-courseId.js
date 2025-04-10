'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('UserCourses', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_userCourses_courseId',
      references: {
        table: 'Courses',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('UserCourses', 'fk_userCourses_courseId');
  }
};