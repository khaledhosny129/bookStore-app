const { sequelize } = require('../models');


const syncDatabase = async (force = false, alter = false) => {
  try {
    console.log(' Connecting to database...');
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');

    if (alter) {
      console.log(' Syncing database models...');
      await sequelize.sync({ force, alter });
      console.log(' Database models synced successfully.');
    } else {
      console.log(' Database models ready.');
    }
  } catch (error) {
    console.error(' Error syncing database:', error.message);
    throw error;
  }
};

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    return true;
  } catch (error) {
    console.error(' Database connection test: FAILED', error.message);
    return false;
  }
};

module.exports = {
  syncDatabase,
  testConnection
};

