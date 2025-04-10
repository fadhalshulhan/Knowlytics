'use strict';
const fs = require('fs').promises;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const data = JSON.parse(await fs.readFile('./data/userProfiles.json', 'utf8'));
    const userProfilesWithTimestamps = data.map(userProfile => ({
      ...userProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    await queryInterface.bulkInsert('UserProfiles', userProfilesWithTimestamps, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserProfiles', null, {});
  }
};