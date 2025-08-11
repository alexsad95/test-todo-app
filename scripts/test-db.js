require('dotenv').config();

const { sequelize } = require('../src/lib/sequelize');

async function testDatabase() {
  try {
    console.log('=== DATABASE CONNECTION TEST ===');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    if (process.env.DATABASE_URL) {
      console.log('DATABASE_URL (first 50 chars):', process.env.DATABASE_URL.substring(0, 50) + '...');
    }
    
    console.log('\n=== TESTING CONNECTION ===');
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    console.log('\n=== DATABASE INFO ===');
    // Check existing tables
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('Existing tables:', tables.map(t => t.table_name));
    console.log('Total tables found:', tables.length);
    
    // Check access rights
    const currentUser = await sequelize.query('SELECT current_user, current_database();', {
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('Current user:', currentUser[0].current_user);
    console.log('Current database:', currentUser[0].current_database);
    
    // Check database version
    const version = await sequelize.query('SELECT version();', {
      type: sequelize.QueryTypes.SELECT
    });
    
    console.log('PostgreSQL version:', version[0].version.split(' ')[1]);
    
    // Check if we can create tables
    const canCreate = await sequelize.query(`
      SELECT has_table_privilege(current_user, 'information_schema.tables', 'CREATE') as can_create;
    `, { type: sequelize.QueryTypes.SELECT });
    
    console.log('Can create tables:', canCreate[0].can_create);
    
    console.log('\n=== CONNECTION DETAILS ===');
    console.log('Host:', sequelize.config.host);
    console.log('Port:', sequelize.config.port);
    console.log('Database:', sequelize.config.database);
    console.log('SSL enabled:', !!sequelize.config.dialectOptions?.ssl);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    console.error('Error details:', {
      code: error.parent?.code,
      detail: error.parent?.detail,
      hint: error.parent?.hint,
      message: error.message
    });
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

testDatabase()
  .then(() => {
    console.log('\n=== TEST COMPLETED SUCCESSFULLY ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n=== TEST FAILED ===', error);
    process.exit(1);
  });
