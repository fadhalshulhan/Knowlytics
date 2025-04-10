'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/courseCategories.json', 'utf-8'));
    const courseCategoriesWithTimestamps = data.map(courseCategory => ({
      ...courseCategory,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('CourseCategories', courseCategoriesWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('courseCategories', null, {});
  }
};
