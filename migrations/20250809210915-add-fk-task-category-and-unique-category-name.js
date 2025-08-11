'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Categories', ['name'], {
      unique: true,
      name: 'categories_name_unique',
    });

    await queryInterface.addConstraint('Tasks', {
      fields: ['categoryId'],
      type: 'foreign key',
      name: 'tasks_categoryId_fkey',
      references: {
        table: 'Categories',
        field: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Tasks', 'tasks_categoryId_fkey');
    await queryInterface.removeIndex('Categories', 'categories_name_unique');
  },
};