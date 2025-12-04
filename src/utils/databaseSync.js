const { sequelize } = require('../models');


const syncDatabase = async (force = false, alter = false) => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('Syncing database models...');
    await sequelize.sync({ force, alter });
    console.log('Database models synced successfully.');
  } catch (error) {
    console.error('Error syncing database:', error);
    throw error;
  }
};


const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection test: SUCCESS');
    return true;
  } catch (error) {
    console.error('Database connection test: FAILED', error.message);
    return false;
  }
};

module.exports = {
  syncDatabase,
  testConnection
};

