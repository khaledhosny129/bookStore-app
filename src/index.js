const express = require('express');
const cors = require('cors');
require('dotenv').config();

require('./models');

const { testConnection, syncDatabase } = require('./utils/databaseSync');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const inventoryRoutes = require('./routes/inventoryRoutes');
const storeRoutes = require('./routes/storeRoutes');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/store', storeRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Bookstore API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('\n Starting Bookstore API Server...\n');
    
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error(' Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    const shouldAlter = process.env.NODE_ENV === 'development';
    await syncDatabase(false, shouldAlter);

    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log(' Server is running!');
      console.log(` Port: ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API Base URL: http://localhost:${PORT}`);
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;

