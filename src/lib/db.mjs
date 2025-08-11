import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Bridge to CommonJS sequelize models expected by sequelize-cli
const db = require('../../models');

export default db;


