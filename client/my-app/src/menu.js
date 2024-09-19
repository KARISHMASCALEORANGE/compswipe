import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {addtocart, cartToOrder, payment} from './action';
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
const MenuItem = ({ item, isdual,checked, unit, onToggleUnit, onCheck, mainToggleOn }) => {
  const shouldDisplayToggle = item['units'] !== null && item['units2'] !== null;
  const [toggleState, setToggleState] = useState(false);

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
      {shouldDisplayToggle && (
          <div className="flex items-center">
            <ToggleSwitch
              isOn={toggleState[item['productid']] === 'units2'}
              onToggle={() => {
                setToggleState((prevState) => ({
                  ...prevState,
                  [item['productid']]: prevState[item['productid']] === 'units2' ? 'units' : 'units2',
                }));
              }}
            />
           
          </div>
      
        
      )}
       <p>
      {toggleState[item['productid']] === 'units2' ? item['units2'] : item['units']}
      </p>
      
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
              isdual={item['isdual'] === 'true'}
              checked={checkedItems[item['productid']] || false}
              unit={units[item['productid']] || item['units']}
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

let selectedUnit;
// CartSidebar Component
const CartSidebar = ({ isOpen, onClose, cartItems, numberOfPlates, onUpdateQuantity, mainToggleOn, address }) => {
    const [toggleState, setToggleState] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cartId,setcartId] = useState('');
    const [redirectUrl, setRedirectUrl] = useState('');

    function calculateTotalItemCost(item, numberOfPlates, selectedUnit, quantity) {
      let totalItemCost = 0;
      const pricePerUnit = selectedUnit === 'units2' ? item['priceperunits2'] : item['priceperunit'];
      
      totalItemCost = pricePerUnit * quantity * numberOfPlates;
      return totalItemCost.toFixed(2);
    }
  
    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      const selectedUnit = toggleState[item['productid']] || item['units'] || item['units2'];
      const totalItemCost = calculateTotalItemCost(item, numberOfPlates, selectedUnit, item.quantity);
      return sum + parseFloat(totalItemCost);
    }, 0).toFixed(2);

    const cartData = cartItems.reduce((acc, item) => {
      // Determine the selected unit and its price
      const selectedUnit = toggleState[item['productid']] ? item['units2'] : item['units'];
      const selectedPrice = toggleState[item['productid']] ? item['priceperunits2'] : item['priceperunit'];
      const selectedMinUnitsPerPlate = toggleState[item['productid']] ? item['minunits2perplate'] : item['minunitsperplate'];
    
      // Only include the necessary fields
      acc.push({
        addedat: item.addedat,
        category_name: item.category_name,
        image: item.image,
        isdual: item.isdual,
        minunitsperplate: selectedMinUnitsPerPlate,
        price_category: item.price_category,
        priceperunit: selectedPrice,
        product_id_from_csv: item.product_id_from_csv,
        productid: item.productid,
        productname: item.productname,
        quantity: item.quantity,
        unit: selectedUnit
      });
    
      return acc;
    }, []);
    
    
    console.log("cart:",cartData);
    
  
    const AddressCard = ({ address }) => (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delivery Address:</h3>
        <p className="text-gray-600">{address.city}</p>
        <p className="text-gray-600">{address.zip_code}</p>
        <p className="text-gray-600">{address.country}</p>
      </div>
    );
    const cart= {totalAmount,cartData,address};
    console.log("complete cart:",cart);
    const handleInputChange = (itemId, value) => {
      const newQuantity = value === '' ? '' : Number(value); 
      onUpdateQuantity(itemId, newQuantity); 
    };
  
    const handleBlur = (itemId, quantity, minUnitsPerPlate) => {
      const newQuantity = quantity < minUnitsPerPlate ? minUnitsPerPlate : quantity;
      onUpdateQuantity(itemId, newQuantity);
    };
  
    const handleSubmit = async (e) => {
       
        await cartToOrder(cartId);
        // try {
        //   const response = await axios.post('http://localhost:5000/api/pay', {
        //     userid : 123,
        //     total_amount: totalAmount,            
        //   });
          
        //   if (response.data && response.data.redirectUrl) {
        //     setRedirectUrl(response.data.redirectUrl);
        //     window.location.href = response.data.redirectUrl;
        //   } else {
        //     console.log('Unexpected response format.');
        //   }
        // } catch (err) {
        //   console.log(`err.response ? Error: ${err.response.data.message || 'An error occurred. Please try again.'} : 'Network error or no response from the server.'`);
        // }finally {
        //    setLoading(false);
        // }
    }


  
    useEffect(() => {
      const delay = setTimeout(async () => {

        const {cart_id}=await addtocart(cart);
        setcartId(cart_id);
        console.log(cart_id);
      }, 5000); 
      return () => clearTimeout(delay);
    }, [cart]);
    
    return (
      <div className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-left text-yellow-600">Your Cart</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>
          <AddressCard address={address} />
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {cartItems.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-600 text-lg">
                  Your cart is empty. Fill the cart to proceed.
                </div>
              ) : (
                cartItems.map(item => {
                  const minUnitsPerPlate = item['minunitsperplate'] || 1;
                  const selectedUnit = toggleState[item['productid']] || item['units'] || item['units2'];
                  const selectedUnitPrice = selectedUnit === 'units2' ? item['priceperunits2'] : item['priceperunit'];
                  const totalItemCost = calculateTotalItemCost(item, numberOfPlates, selectedUnit, item.quantity);
  
                  return (
                    <div key={item['productid']} className="flex flex-col mb-4 border-b border-gray-200 pb-4">
                      <div className="flex flex-col items-center mb-2">
                        <h3 className="font-semibold text-gray-800 mb-1">{item['productname']}</h3>
                        <img src={item.image} alt={item['productname']} className="w-24 h-24 object-cover rounded mb-2" />
                        {item['units'] && item['units2'] && (
                          <div className="flex items-center mb-2">
                            <ToggleSwitch
                              isOn={toggleState[item['productid']] === 'units2'}
                              onToggle={() => {
                                setToggleState((prevState) => ({
                                  ...prevState,
                                  [item['productid']]: prevState[item['productid']] === 'units2' ? 'units' : 'units2',
                                }));
                              }}
                            />
                            <p className="ml-2">
                              {toggleState[item['productid']] === 'units2' ? item['units2'] : item['units']}
                            </p>
                          </div>
                        )}
                        {!item['units2'] && (
                          <p>{item['units']}</p>
                        )}
                        <p className="text-sm text-gray-600 mb-2 flex flex-col items-center">
                          <span className="text-gray-700 mt-1">
                            {`${selectedUnitPrice} * ${item.quantity} * ${numberOfPlates} = `}
                            <span className="text-gray-800 font-semibold">${totalItemCost}</span>
                          </span>
                        </p>
                      </div>
  
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
          </div>
  
          {cartItems.length > 0 && (
            <div className="flex flex-col justify-end mt-4">
              <div className="text-xl font-bold text-gray-800 ">
                Total Amount: ${totalAmount}
              </div>
              <button 
                onClick={handleSubmit} 
                className="py-2 px-4 bg-yellow-500 text-gray-800 font-bold rounded"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
        {/* <Menu
         selectedUnit={selectedUnit}
         totalAmount={totalAmount}
        /> */}
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
    const [mainToggleOn, setMainToggleOn] = useState(false);
    const location = useLocation();
    const numberOfPlates = location.state?.numberOfPlates || 1;

    const address = location.state?.address || {
      street: '123 Main St',
      city: 'Hyderabad',
      zip_code: '10001',
      country: 'Telangana'
    };
  
    // Handle unit toggle
    const onToggleUnit = (productId) => {
      setUnits(prevUnits => ({
        ...prevUnits,
        [productId]: mainToggleOn ? 'units2' : (prevUnits[productId] === 'units' ? 'units2' : 'units')
      }));
    };
  
    useEffect(() => {
      if (mainToggleOn) {
        setUnits(prevUnits => 
          Object.keys(prevUnits).reduce((acc, itemId) => {
            acc[itemId] = 'units2';
            return acc;
          }, {})
        );
      } else {
        setUnits(prevUnits => 
          Object.keys(prevUnits).reduce((acc, itemId) => {
            acc[itemId] = 'units'; // or any default value
            return acc;
          }, {})
        );
      }
    }, [mainToggleOn]);
  
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          const transformedData = data.reduce((acc, item) => {
            const category = item['category_name'];
            if (!acc[category]) {
              acc[category] = { category, items: [] };
            }
  
            const isdual = item['isdual'] === 'true';
            acc[category].items.push(item);
            return acc;
          }, {});
  
          setMenuData(Object.values(transformedData));
  
          const initialUnits = {};
          data.forEach(item => {
            initialUnits[item['productid']] = item['units'];
          });
          setUnits(initialUnits);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchProducts();
    }, []);
  
    const updateQuantity = (itemId, newQuantity) => {
      setQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
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
  
   
  
    const cartItems = menuData.flatMap(category =>
      category.items
        .filter(item => quantities[item['productid']] > 0)
        .map(item => ({
          ...item,
          quantity: quantities[item['productid']],
          unit: units[item['productid']] || item['units']
        }))
    );


  console.log("menudata",cartItems);

  return (
    <div className="bg-gradient-to-b from-[#008000]">
      <div className="bg-gradient-to-b from-[#008000] to-[#70c656]">
        <div className="flex justify-between items-center bg-gradient-to-b from-[#008000] to-[#70c656] py-4 px-6">
          <h1 className="text-2xl font-bold text-white">EVENT MENU CARD</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-green-500 text-white p-2 rounded"
          >
            <div>
            <ShoppingCart size={24} />
            </div>

            {cartItems.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
          {cartItems.length}
        </span>
      )}

            {/* {totalQuantity > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                {totalQuantity}
              </span>
            )} */}
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
             onToggleUnit={onToggleUnit} // Pass the function as a prop
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
        onToggleUnit={onToggleUnit} 
        address={address} 
        // units={units}
      />
    </div>
  );
};

export default Menu;


