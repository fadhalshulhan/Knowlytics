'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Lessons', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_lessons_courseId',
      references: {
        table: 'Courses',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Lessons', 'fk_lessons_courseId');
  }
};