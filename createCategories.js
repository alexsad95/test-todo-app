require('dotenv').config();

const { sequelize } = require('./src/lib/sequelize');
const db = require('./models');
const Category = db.Category;

async function createCategories() {
  try {
    console.log('Creating categories...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    const categories = [
      { name: 'Work', color: '#EF4444' },
      { name: 'Home', color: '#10B981' },
      { name: 'Study', color: '#3B82F6' },
      { name: 'Health', color: '#F59E0B' }
    ];
    
    for (const category of categories) {
      await Category.findOrCreate({
        where: { name: category.name },
        defaults: category
      });
    }
    
    console.log('Categories created successfully!');
    
    const allCategories = await Category.findAll();
    console.log('All categories:', allCategories.map(c => c.name));
    
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Запускаем только если файл вызван напрямую
if (require.main === module) {
  createCategories()
    .then(() => {
      console.log('Categories setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Categories setup failed:', error);
      process.exit(1);
    });
}

module.exports = createCategories;


