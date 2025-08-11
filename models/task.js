'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Category, {
        as: 'category',
        foreignKey: 'categoryId',
        onDelete: 'SET NULL',
      });
    }
  }

  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Task',
    tableName: 'Tasks',
    timestamps: true,
    indexes: [
      {
        fields: ['priority'],
      },
      {
        fields: ['categoryId'],
      },
    ],
  });

  return Task;
};