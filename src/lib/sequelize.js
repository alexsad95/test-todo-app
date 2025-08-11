const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // Production (Render) - with SSL
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development (locally) - without SSL
  const db = process.env.POSTGRES_DB || 'todo_db';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || null;
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = Number(process.env.POSTGRES_PORT || 5432);

  sequelize = new Sequelize(db, user, password, {
    host,
    port,
    dialect: 'postgres',
    logging: false,
  });
}

module.exports = { sequelize };


