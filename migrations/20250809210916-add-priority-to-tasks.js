'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'priority', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
      after: 'completed'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'priority');
  }
};
