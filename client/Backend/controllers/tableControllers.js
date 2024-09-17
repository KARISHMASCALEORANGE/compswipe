const client = require('../config/dbconfig');
const logger = require('../config/logger');
const { 
    createCustomerTableQuery,
    createPaymentTableQuery,
    createEventOrdersTableQuery,
    createEventCategoryTableQuery,
    createAddressesTableQuery,
    createEventCartTableQuery,
    createEventProductsTableQuery
} = require('../utils/tableSchema');

const createTables = async () => {


  try {
    await client.query(createCustomerTableQuery());
    console.log('Customer table created successfully');
  } catch (error) {
    console.error('Error creating Customer table:', error);
  }

  try {
    await client.query(createPaymentTableQuery());
    console.log('Payment table created successfully');
  } catch (error) {
    console.error('Error creating Payment table:', error);
  }





  try {
    await client.query(createEventOrdersTableQuery());
    console.log('Event Orders table created successfully');
  } catch (error) {
    console.error('Error creating Event Orders table:', error);
  }

  try {
    await client.query(createEventCategoryTableQuery());
    console.log('Event Category table created successfully');
  } catch (error) {
    console.error('Error creating Event Category table:', error);
  }



  try {
    await client.query(createAddressesTableQuery());
    console.log('Addresses table created successfully');
  } catch (error) {
    console.error('Error creating Addresses table:', error);
  }

  try {
    await client.query(createEventCartTableQuery());
    console.log('Event Cart table created successfully');
  } catch (error) {
    console.error('Error creating Event Cart table:', error);
  }

 

  try {
    await client.query(createEventProductsTableQuery());
    console.log('Event Products table created successfully');
  } catch (error) {
    console.error('Error creating Event Products table:', error);
  }

};

module.exports = {
  createTables
};