'use strict';
const fs = require('fs').promises;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = JSON.parse(await fs.readFile('./data/users.json', 'utf8'));
    const usersWithTimestamps = data.map(user => ({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('Users', usersWithTimestamps, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};