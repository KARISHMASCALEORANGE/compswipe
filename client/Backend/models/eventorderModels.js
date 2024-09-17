const logger = require('../config/logger.js');
const { DB_COMMANDS} = require('../utils/queries.js');
const client = require('../config/dbconfig.js');



const getAllProductCategories = async ()=>{
  try {
//    console.log(DB_COMMANDS.getEventCategoriesQuery());
    const result = await client.query(`SELECT * FROM event_products`);
    console.log("hello karishma",result);
    return result.rows
    // console.log("object")
  } catch (error) {
    throw new Error('Error fetching event products');
  }
}



const addToCart = async ( customer_id, total_amount, cart_order_details, address) => {
  const query = `
    INSERT INTO event_cart (customer_id, total_amount, cart_order_details, address,order_date)
    VALUES ($1, $2, $3, $4,$5)
    RETURNING *;
  `;
  const now = Date.now(); // Current timestamp in milliseconds
const isoString = new Date(now).toISOString(); 
  const values = [customer_id, total_amount, JSON.stringify(cart_order_details), JSON.stringify(address),isoString];

  try {
    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error inserting into event_cart:', error);
    throw error;
  }
};





module.exports = {

  getAllProductCategories,
  addToCart
  
};
