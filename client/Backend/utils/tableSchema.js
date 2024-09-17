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
      CREATE TABLE IF NOT EXISTS event_orders (
        eventorder_id SERIAL PRIMARY KEY,
        customer_id INTEGER,
        ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivery_status VARCHAR(50),
        total_amount INTEGER NOT NULL,
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
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       
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