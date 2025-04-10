'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('CourseCategories', {
      fields: ['courseId'],
      type: 'foreign key',
      name: 'fk_courseCategories_courseId',
      references: {
        table: 'Courses',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('CourseCategories', 'fk_courseCategories_courseId');
  }
};