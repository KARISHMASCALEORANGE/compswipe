const express = require('express');
const client = require('./config/dbconfig.js');
const cors=require('cors')     
const logger = require('./config/logger');
const { createTables } = require('./controllers/tableControllers.js');
const { createDatabase } = require('./config/config');
require('dotenv').config();
// const allRoutes = require('./routes/customerRoutes.js');
// const adminRoutes = require('./routes/adminRoutes');
const eventRoutes = require ('./routes/eventorderRoutes.js')
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api', eventRoutes);


// app.use('/admin', adminRoutes);

const initializeApp = async () => {
  try {
    await createDatabase();
    logger.info('Database created or already exists');

    await client.connect();
    logger.info('Connected to the Caterorange DB');

    await createTables();
    logger.info('Tables created successfully');

    app.use(express.json());

    app.listen(process.env.PORT, () => {
      logger.info(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    logger.error('Initialization error:', err.message);
    process.exit(1);
  }
};

initializeApp();
// app.use('/api', eventRoutes);