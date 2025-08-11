'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const BASENAME = path.basename(__filename);
const ENV = process.env.NODE_ENV || 'development';
const CONFIG = require(path.join(__dirname, '..', 'config', 'config.js'))[ENV];

const db = {};

let sequelize;

if (CONFIG.use_env_variable) {
  sequelize = new Sequelize(process.env[CONFIG.use_env_variable], CONFIG);
} else {
  sequelize = new Sequelize(
    CONFIG.database, 
    CONFIG.username, 
    CONFIG.password, 
    CONFIG
  );
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    const isValidModelFile = (
      file.indexOf('.') !== 0 &&
      file !== BASENAME &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
    return isValidModelFile;
  })
  .forEach(file => {
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath)(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
