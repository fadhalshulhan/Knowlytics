'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/lesson.json', 'utf-8'));
    const lessonsWithTimestamps = data.map(lesson => ({
      ...lesson,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Lessons', lessonsWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lessons', null, {});
  }
};
