'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/courses.json', 'utf-8'));
    const coursesWithTimestamps = data.map(course => ({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Courses', coursesWithTimestamps, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', null, {});
  }
};