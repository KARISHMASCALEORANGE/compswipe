import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// ToggleSwitch Component
const ToggleSwitch = ({ isOn, onToggle }) => (
  <div
    className={`w-8 h-4 flex items-center rounded-full p-1 cursor-pointer ${isOn ? `bg-green-500` : `bg-gray-300`}`}
    onClick={onToggle}
  >
    <div
      className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? `translate-x-4` : `translate-x-0`}`}
    ></div>
  </div>
);

// MenuItem Component
const MenuItem = ({ item, checked, unit, onToggleUnit, onCheck, mainToggleOn }) => {
  const shouldDisplayToggle = item.isdual === 'TRUE';
  console.log("items",item);
  console.log(item['productname']);

  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-200">
      <div className="flex items-center flex-grow">
        <img src={item.image} alt={item['productname']} className="w-16 h-16 object-cover rounded mr-4" />
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{item['productname']}</h3>

          <input
            type="checkbox"
            checked={checked}
            onChange={onCheck}
            className="ml-2"
          />
        </div>
      </div>
      <div className={`flex items-center ${mainToggleOn ? `justify-end` : `justify-start`}`}>
        {/* Display the corresponding unit text above the toggle */}
        <div className="text-sm text-gray-600 mr-2">
          {unit}
        </div>
        {shouldDisplayToggle && (
          <div className="flex items-center">
            <ToggleSwitch
              isOn={unit === item['Units']}
              onToggle={onToggleUnit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// MenuCategory Component
const MenuCategory = ({ category, items, checkedItems, units, onToggleUnit, onCheck, mainToggleOn }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 bg-white rounded-lg shadow">
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-semibold text-gray-800">{category}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div>
          {items.map(item => (
            <MenuItem
              key={item['productid']}
              item={item}
              checked={checkedItems[item['productid']] || false}
              unit={units[item['productid']] || item['Units']}
              onToggleUnit={() => onToggleUnit(item['productid'])}
              onCheck={() => onCheck(item['productid'])}
              mainToggleOn={mainToggleOn}
            />
          ))}
        </div>
      )}
    </div>
  );
};


// CartSidebar Component
const CartSidebar = ({ isOpen, onClose, cartItems, numberOfPlates, onUpdateQuantity, onToggleUnit }) => {

  function calculateTotalItemCost(item, numberOfPlates, selectedUnit, enteredValue) {
    let totalItemCost = 0;
    
    if (selectedUnit === item['units']) {
      const priceperunit = item['priceperunit'];
      console.log("hi", priceperunit);
      totalItemCost = numberOfPlates * priceperunit * item.quantity;
      // console.log("idly", totalItemCost);  
  } 
  if (item['price_category'] === 'kg' || item['price_category'] === 'lt') {
    totalItemCost = enteredValue * item['priceperunit'];
    console.log("kg",totalItemCost);
  }

    else if (selectedUnit === item['units2']) {
      const costPerSmallerUnit = item['priceperunit'] / item['MinUnitsperPlate'];
      totalItemCost = costPerSmallerUnit * enteredValue * numberOfPlates;

    } else  if (selectedUnit === item['Units']) {
      const priceperunit = item['priceperunit'];
      console.log("hi", priceperunit);
      totalItemCost = numberOfPlates * priceperunit * item.quantity;
      console.log("idly", totalItemCost);  
  } 

    return totalItemCost.toFixed(2);
  }

  // Calculate total amount
  const totalAmount = cartItems.reduce((sum, item) => {
    const selectedUnit = item.unit; // Use the unit from the cart item
    const totalItemCost = calculateTotalItemCost(item, numberOfPlates, selectedUnit, item.quantity);
    return sum + parseFloat(totalItemCost);
  }, 0).toFixed(2);

    
  useEffect(() => {
    const postCartItems = async () => {
      // Construct the address, total amount, and cart order details
      const address = {
        street: "123 Main St",
        city: "New York",
        zip_code: "10001",
        country: "USA"
      };

      
  
      const cartOrderDetails = cartItems.map(item => ({
        product_id: item.productid, // Ensure the product id is correct
        product_name: item.productname,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.priceperunit
      }));
  
     
      const payload = {
        total_amount: totalAmount,  // Total amount from your calculation
        cart_order_details: cartOrderDetails,  // Map cart items into the required format
        address  // Address information
      };
      console.log("payload",payload);
      try {
        // Send the data as JSON to the backend
        const response = await axios.post('http://localhost:5000/api/cart/add', payload, {
          headers: {
            'Content-Type': 'application/json'  // Ensure the request is sent as JSON
          }
        });
  
        console.log("Response from backend:", response.data);  
  
        if (response.status === 200) {
          console.log('Cart items successfully posted to the backend');
        } else {
          console.error(`Error: Received status code ${response.status}`);
        }
      } catch (err) {
        if (err.response) {
          console.error("Error posting:", err.response.data); 
        } else {
          console.error("Error posting cart items:", err.message);  
        }
      }
    };
  
    postCartItems();
  }, [cartItems, totalAmount]);  
  
  
  
  // const navigate = useNavigate();
  const categoriesWithoutToggle = ['BREAKFAST ITEMS', 'WELCOME DRINKS'];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  // Handle input value change
// Allow free input without restrictions
const handleInputChange = (itemId, value) => {
  // Allow empty string input but don't update the quantity just yet
  const newQuantity = value === '' ? '' : Number(value); 
  onUpdateQuantity(itemId, newQuantity); // Update the quantity in state
};

// Reset to minimum if the input is invalid or empty on blur
const handleBlur = (itemId, quantity, minUnitsPerPlate) => {
  // Reset to the minimum allowed quantity if the input is empty or less than the min
  const newQuantity = quantity < minUnitsPerPlate ? minUnitsPerPlate : quantity;
  onUpdateQuantity(itemId, newQuantity); // Update the quantity to the correct value
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log("paynowpage");



    
    try {
      const response = await axios.post('http://localhost:5000/pay', {
        amount: totalAmount
      });
      
      if (response.data && response.data.redirectUrl) {
        setRedirectUrl(response.data.redirectUrl);
        window.location.href = response.data.redirectUrl;
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      setError(`err.response ? Error: ${err.response.data.message || 'An error occurred. Please try again.'} : 'Network error or no response from the server.'`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Cart</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-600 text-lg">
              Your cart is empty. Fill the cart to proceed.
            </div>
          ) : (
            cartItems.map(item => {
              const minUnitsPerPlate = item['minunitsperplate'] || 1;
              const displaypriceperunit = item.unit === item['units'] 
               ? item['priceperunit'] 
               : (item.unit === item['units2'] 
               ? item['priceperunit'] / item['minunitsperplate'] 
               : item['priceperunit']);
              const totalItemCost = calculateTotalItemCost(item, numberOfPlates, item.unit, item.quantity);
              const isPcs = item['Units'] === 'pcs';
              const isKgOrLt = item['price_category'] === 'kg' || item['price_category'] === 'lt';
              const isSmallerUnit = item['Units_1'] === 'gms' || item['Units_1'] === 'ml';
             
              console.log('isSmallerUnit:', isSmallerUnit);
              console.log("cartitems",cartItems);
              return (
                <div key={item['productid']} className="flex flex-col mb-4 border-b border-gray-200 pb-4">
                  <div className="flex flex-col items-center mb-2">
                    <h3 className="font-semibold text-gray-800 mb-1">{item['productname']}</h3>
                    <img src={item.image} alt={item['productname']} className="w-24 h-24 object-cover rounded mb-2" />
                    <p className="text-sm text-gray-600 mb-2 flex flex-col items-center">
                      <span className="font-medium text-gray-800">Item Cost:</span>
                      <span className="text-gray-700 mt-1">
                        {isPcs
                         ? ` ${item.quantity}* ${item['priceperunit']} * ${numberOfPlates} = `
                        :isKgOrLt
                          ? `${displaypriceperunit} * ${item.quantity} = `
                          : isSmallerUnit
                            ? `${displaypriceperunit} * ${item.quantity} * ${numberOfPlates} = `
                            : `${displaypriceperunit} * ${item.quantity} = `
                        }
                        <span className="text-gray-800 font-semibold">${totalItemCost}</span>
                      </span>
                    </p>
                  </div>

                  {!categoriesWithoutToggle.includes(item.category_name) && item.isdual === 'TRUE' && (
                    <div className="flex items-center mb-2">
                      <ToggleSwitch 
                        isOn={item.unit === item['units']}
                        onToggle={() => onToggleUnit(item['productid'])}
                      />
                      <span className="text-sm text-gray-600">{item.unit}</span>
                    </div>
                  )}

<div className="flex items-center justify-center mb-2">
  <button 
    onClick={() => onUpdateQuantity(item['productid'], Math.max(item.quantity - 1, 1))} 
    className="p-1 bg-green-500 text-white rounded-l"
  >
    <Minus size={14} />
  </button>
  
  <input 
    type="number" 
    value={item.quantity} 
    onChange={(e) => handleInputChange(item['productid'], e.target.value, minUnitsPerPlate)} 
    onBlur={() => handleBlur(item['productid'], item.quantity, minUnitsPerPlate)} 
    className="w-12 text-center px-2 py-1 border"
    min="0"
  />
  
  <button 
    onClick={() => onUpdateQuantity(item['productid'], item.quantity + 1)} 
    className="p-1 bg-green-500 text-white rounded-r"
  >
    <Plus size={14} />
  </button>
</div>

                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="flex flex-col justify-end mt-auto">
            <div className="mt-4 text-xl font-bold text-gray-800 mb-2">
              Total Amount: ${totalAmount}
            </div>

           <button onClick={handleSubmit} className="mt-4 py-2 px-4 bg-yellow-500 text-gray-800 font-bold rounded">
              Pay Now
            </button>

          </div>
         
        )}
      </div>
    </div>
  );
};





// Menu Component
const Menu = () => {
  const [menuData, setMenuData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [units, setUnits] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mainToggleOn, setMainToggleOn] = useState(false); // Main toggle state
  const location = useLocation();
  const[mydata,setMydata]=useState({})
  const numberOfPlates = location.state?.numberOfPlates || 1; // Retrieve the number of plates from location state
  // const navigate = useNavigate(); 
  
  // useEffect(() => {
  //   fetch('/priceList.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       const transformedData = data.reduce((acc, item) => {
  //         const category = item['Category_Name'];
  //         if (!acc[category]) {
  //           acc[category] = { category, items: [] };
  //         }
  //         acc[category].items.push(item);
  //         return acc;
  //       }, {});

  //       setMenuData(Object.values(transformedData));

  //       const initialUnits = {};
  //       data.forEach(item => {
  //         initialUnits[item['productid']] = item['Units'];
  //       });
  //       setUnits(initialUnits);
  //     })
  //     .catch(error => console.error('Error fetching data:', error));
  // }, []);

  // Fetch products and transform the data into categories
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await fetch('http://localhost:5000/api/products');
  //       console.log("res",response);
  //       const data = response.rows;
  //       console.log("data",data);

  //       // Transform the data into categories
  //       const transformedData = data.reduce((acc, item) => {
  //         const category = item['Breakfast'];
  //         if (!acc[category]) {
  //           acc[category] = { category, items: [] };
  //         }
  //         acc[category].items.push(item);
  //         return acc;
  //       }, {});

  //       setMenuData(Object.values(transformedData));

  //       const initialUnits = {};
  //       data.forEach(item => {
  //         initialUnits[item['productid']] = item['Units'];
  //       });
  //       setUnits(initialUnits);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        console.log("res", response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json(); 
        // setMydata[data]
        
        
        // Access the rows property
        
        console.log("data", data);
  
        // Transform the data into categories
        const transformedData = data.reduce((acc, item) => {
          const category = item['category_name']; // Use the correct field for category
          if (!acc[category]) {
            acc[category] = { category, items: [] };
          }
          acc[category].items.push(item);
          console.log("acc",acc)
          return acc;
        }, {});
  
        setMenuData(Object.values(transformedData)); // Update state with transformed categories
  
        // Set initial uniconsolets for each product
        
        const initialUnits = {};
        data.forEach(item => {
          initialUnits[item['productid']] = item['Units']; // Use the correct field for units
        });
        setUnits(initialUnits); // Update state with initial units
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchProducts();
  }, []);
  

  // Update item toggles based on the main toggle state
  useEffect(() => {
    setUnits(prevUnits => {
      const updatedUnits = {};
      menuData.flatMap(category => category.items).forEach(item => {
        if (item.isdual === 'TRUE') {
          updatedUnits[item['productid']] = mainToggleOn ?  item['units']:item['units2'];
        }
      });
      return updatedUnits;
    });
  }, [mainToggleOn, menuData]);

  const updateQuantity = (itemId, newQuantity) => {
    setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
  };

  const toggleUnit = (itemId) => {
    const item = menuData
      .flatMap(category => category.items)
      .find(item => item['productid'] === itemId);

    if (item && item.isdual === 'TRUE') {
      setUnits(prev => ({
        ...prev,
        [itemId]: prev[itemId] === item['units'] ? item['units2'] : item['units']
      }));
    }
  };

  const handleCheck = (itemId) => {
    const newCheckedItems = { ...checkedItems, [itemId]: !checkedItems[itemId] };
    setCheckedItems(newCheckedItems);
    if (!checkedItems[itemId]) {
      setQuantities(prev => ({ ...prev, [itemId]: 1 }));
    } else {
      setQuantities(prev => ({ ...prev, [itemId]: 0 }));
    }
  };


  const totalQuantity = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const cartItems = menuData.flatMap(category =>
    category.items
      .filter(item => quantities[item['productid']] > 0)
      .map(item => ({
        ...item,
        quantity: quantities[item['productid']],
        unit: units[item['productid']] || item['Units'], 
        price: units[item['productid']] === item['Units'] 
                ? item['priceperunit'] 
                : item['priceperunits2'],
        category: category.category
      }))
  );

  return (
    <div className="bg-gradient-to-b from-[#008000]">
      <div className="bg-gradient-to-b from-[#008000] to-[#70c656]">
        <div className="flex justify-between items-center bg-gradient-to-b from-[#008000] to-[#70c656] py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Menu</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-green-500 text-white p-2 rounded"
          >
            <ShoppingCart size={24} />
            {totalQuantity > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
        {/* Main Toggle Switch */}
        <div className="flex justify-center py-2">
          <ToggleSwitch
            isOn={mainToggleOn}
            onToggle={() => setMainToggleOn(prev => !prev)}
          />
        </div>
      </div>
      <div className="p-6">
        {menuData.map(category => (
             <MenuCategory
             key={category.category}
             category={category.category}
             items={category.items}
             checkedItems={checkedItems}
             units={units}
             onToggleUnit={toggleUnit}
             onCheck={handleCheck}
             mainToggleOn={mainToggleOn}  // Passing the main toggle state
           />
        ))}
      </div>
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        numberOfPlates={numberOfPlates}  // Number of plates from location state
        onUpdateQuantity={updateQuantity}
        onToggleUnit={toggleUnit}
      />
    </div>
  );
};

export default Menu;







