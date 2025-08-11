require('dotenv').config();
const db = require('./models');

async function main() {
  try {
    await db.sequelize.authenticate();
    const categories = ['Work', 'Home', 'Hobby', 'Study', 'Other'];
    for (const name of categories) {
      await db.Category.findOrCreate({ where: { name }, defaults: { name } });
    }
    console.log('Categories ensured:', categories.join(', '));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();


