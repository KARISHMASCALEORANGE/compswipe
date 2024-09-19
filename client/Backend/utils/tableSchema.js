// Create Customer Table
function createCustomerTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS customer (
        customer_id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        customer_phoneNumber BIGINT,
        customer_email VARCHAR(255) NOT NULL UNIQUE,
        customer_address JSON,
        customer_password VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lastLoginAt TIMESTAMP,
        wallet_amount INTEGER,
        group_id INTEGER,
        access_token VARCHAR(255),
        isDeactivated BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
      );
    `;
  }
  
  // Create Payment Table
  function createPaymentTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS payment (
        PaymentId SERIAL PRIMARY KEY,
        PaymentType VARCHAR(50),
        MerchantReferenceId VARCHAR(255),
        PhonePeReferenceId VARCHAR(255),
        "From" VARCHAR(255),
        Instrument VARCHAR(50),
        CreationDate DATE,
        TransactionDate DATE,
        SettlementDate DATE,
        BankReferenceNo VARCHAR(255),
        Amount INTEGER NOT NULL,
        Fee FLOAT,
        IGST FLOAT,
        CGST FLOAT,
        SGST FLOAT,
        customer_id INTEGER,
        paymentDate TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
      );
    `;
  }
  

  
  // Create Event Orders Table
  function createEventOrdersTableQuery() {
    return `
      -- Create function to generate eventorder_generated_id
      CREATE OR REPLACE FUNCTION generate_eventorder_id() RETURNS TRIGGER AS $$
      DECLARE
          today_date TEXT;
          order_count INT;
          customer_gen_id TEXT;
      BEGIN  
          -- Get today's date in YYYYMMDD format
          today_date := TO_CHAR(NOW(), 'YYYYMMDD');
          
          -- Get the customer's generated id
          SELECT customer_generated_id INTO customer_gen_id FROM customer WHERE customer_id = NEW.customer_id;
          
          -- Count the number of orders placed by the customer today in the event_orders table
          SELECT COUNT(*) + 1 INTO order_count
          FROM event_orders
          WHERE customer_id = NEW.customer_id
          AND TO_CHAR(ordered_at, 'YYYYMMDD') = today_date;
          
          -- Concatenate EO, today's date, the order count, and the customer_generated_id
          NEW.eventorder_generated_id := 'EO' || today_date || order_count || customer_gen_id;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
  
     -- Drop the trigger if it already exists
   DROP TRIGGER IF EXISTS eventorder_id_trigger ON event_orders;

    -- Create the event_orders table
    CREATE TABLE IF NOT EXISTS event_orders (
      eventorder_id SERIAL PRIMARY KEY,
      eventorder_generated_id VARCHAR(255) UNIQUE,
      customer_id INTEGER,
      ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      delivery_status VARCHAR(50),
      total_amount FLOAT NOT NULL,
      PaymentId INTEGER,
      delivery_details JSON,
      event_order_details JSON,
      event_media JSON,
      customer_address JSON,
      payment_status VARCHAR(50),
      event_order_status VARCHAR(50),
      FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
      FOREIGN KEY (PaymentId) REFERENCES payment(PaymentId)
    );
    

    -- Create trigger that calls the function to generate eventorder_generated_id
    CREATE TRIGGER eventorder_id_trigger
    BEFORE INSERT ON event_orders
    FOR EACH ROW
    EXECUTE FUNCTION generate_eventorder_id();

  `;
}




  
  // Create Event Category Table
  function createEventCategoryTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS event_category (
        category_id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        category_media TEXT,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  }
  

  
  
  // Create Addresses Table
  function createAddressesTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS addresses (
        address_id SERIAL PRIMARY KEY,
        tag VARCHAR(50),
        line1 VARCHAR(255) NOT NULL,
        line2 VARCHAR(255),
        pincode INTEGER,
        group_id INTEGER,
        location POINT,
        ship_to_name VARCHAR(255),
        ship_to_phone_no BIGINT,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (group_id) REFERENCES groups(group_id)
      );
    `;
  }
  
  // Create Event Cart Table
  function createEventCartTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS event_cart (
        eventcart_id SERIAL PRIMARY KEY,
        order_date DATE,
        customer_id INTEGER,
        total_amount FLOAT,
        cart_order_details JSON,
        address JSON,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
      );
    `;
  }
  

  
  // Create Event Products Table
  function createEventProductsTableQuery() {
    return `
      CREATE TABLE IF NOT EXISTS event_products (
        productId SERIAL PRIMARY KEY,
        product_id_from_csv VARCHAR NOT NULL UNIQUE,
        ProductName VARCHAR(255),
        Image TEXT,
        Category_Name VARCHAR(255),
        Price_Category VARCHAR(255),
        isDual BOOLEAN,
        Units VARCHAR(255),
        PriceperUnit FLOAT,
        MinUnitsperPlate INTEGER,
        Units2 VARCHAR(255),
        PriceperUnits2 FLOAT,
        MinUnits2perPlate INTEGER,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  }
  
  
  module.exports = {
    createCustomerTableQuery,
    createPaymentTableQuery,
    createEventOrdersTableQuery,
    createEventCategoryTableQuery,
    createAddressesTableQuery,
    createEventCartTableQuery,
    createEventProductsTableQuery,
  };