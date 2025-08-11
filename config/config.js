'use strict';

require('dotenv').config();

const DATABASE_CONFIG = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
};

const PRODUCTION_SSL_CONFIG = {
  dialectOptions: {
    ssl: process.env.PGSSL === 'true' 
      ? { 
          require: true, 
          rejectUnauthorized: false 
        } 
      : undefined,
  },
};

module.exports = {
  development: {
    use_env_variable: 'DATABASE_URL',
    ...DATABASE_CONFIG,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    ...DATABASE_CONFIG,
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    ...DATABASE_CONFIG,
    ...PRODUCTION_SSL_CONFIG,
    logging: false,
  },
};
