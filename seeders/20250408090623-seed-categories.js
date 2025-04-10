'use strict';
const fs = require('fs').promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile('./data/categories.json', 'utf-8'));
    const categoriesWithTimestamps = data.map(category => ({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Categories', categoriesWithTimestamps, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
