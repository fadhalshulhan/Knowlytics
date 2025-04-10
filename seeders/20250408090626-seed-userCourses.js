'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/userCourses.json', 'utf-8'));
    const userCoursesWithTimestamps = data.map(userCourse => ({
      ...userCourse,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('UserCourses', userCoursesWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userCourses', null, {});
  }
};
