import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'; // Import ChevronRight
import ProductCard from './card';
import BreakfastCard from './BreakfastCard';
import Sidebar from './Sidebar'; // Import Sidebar component
import { useSwipeable } from 'react-swipeable'; // Import useSwipeable

// Custom Toggle Switch Component
const UnitSwitch = ({ unit, toggleUnit }) => {
  return (
    <div
      className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 
        ${unit === 'kg' ? 'bg-blue-500' : 'bg-green-500'
      }`}
      onClick={toggleUnit}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
          ${unit === 'kg' ? 'translate-x-0' : 'translate-x-6'
        }`}
      ></div>
    </div>
  );
};

const MenuItem = ({ category, item, onCartUpdate, unit }) => {
  const [count, setCount] = useState(0);

  const handleIncrease = (newQuantity) => {
    const difference = newQuantity - count;
    setCount(newQuantity);
    onCartUpdate(item, difference);
  };

  const handleDecrease = (newQuantity) => {
    const difference = count - newQuantity;
    setCount(newQuantity);
    onCartUpdate(item, -difference);
  };

  const renderCard = () => {
    if (category === 'Breakfast') {
      return <BreakfastCard unit={unit} />;
    }
    return (
      <ProductCard
        count={count}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        unit={unit}
      />
    );
  };

  return <div>{renderCard()}</div>;
};

const CollapsibleSection = ({ title, count, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">  
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-3 bg-white rounded-lg shadow cursor-pointer"
      >
        <span className="font-medium">{title}</span>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 mr-2 text-white bg-green-500 rounded-full">
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            />
          </div>
          <div className="flex items-center justify-center w-8 h-8 text-xs text-white bg-blue-500 rounded-full">
            {count}
          </div>
        </div>
      </div>
      {isOpen && <div className="mt-2">{children}</div>}
    </div>
  );
};

const Menu = () => {
  const [cartItems, setCartItems] = useState([]); // Track cart items
  const [unit, setUnit] = useState('kg'); // State for toggle between kg and plate
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Control sidebar visibility

  const updateCartCount = (item, change) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.title === item.title);
      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        if (change > 0) {
            console.log("change",change)
          updatedItems[existingItemIndex].quantity += 1;
        } else if (updatedItems[existingItemIndex].quantity + 1 <= 0) {
          updatedItems.splice(existingItemIndex, 1); // Remove item if quantity is zero or less
        } else {
          updatedItems[existingItemIndex].quantity += 1;
        }
        return updatedItems;
      } else if (change > 0) {
        // Add new item
        return [...prevItems, { ...item, quantity: change }];
      }
      return prevItems;
    });
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === 'kg' ? 'plate' : 'kg'));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const menuData = [
    {
      category: 'Breakfast',
      items: [
        { title: 'South Indian Breakfast Delights', count: 10 },
        { title: 'North Indian Breakfast Delights', count: 10 }
      ]
    },
    {
      category: 'Lunch',
      items: [
        { title: 'Veg', count: 10 },
        { title: 'Non Veg', count: 20 }
      ]
    },
    {
      category: 'Snacks',
      items: [
        { title: 'North', count: 8 },
        { title: 'South', count: 10 },
        { title: 'Chinese', count: 13 }
      ]
    }
  ];

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSidebarOpen(true),
    onSwipedRight: () => setIsSidebarOpen(false),
    trackMouse: true // Enable mouse tracking for desktop
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Cart Icon */}
      <div className="flex items-center justify-between mb-6 bg-green-600 p-4 rounded">
        <h1 className="text-2xl font-bold text-white">&gt; Menu</h1>
        <div className="flex items-center relative">
          <div className="relative">
            <ShoppingCart
              className="w-8 h-8 text-white cursor-pointer"
              onClick={toggleSidebar}
            />
            {cartItems.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mb-2">
        <div className="flex items-center">
          <UnitSwitch unit={unit} toggleUnit={toggleUnit} />
          <span className="ml-2">Kg/Plate</span>
        </div>
      </div>

      {/* Menu Sections */}
      {menuData.map((section, index) => (
        <div key={index} className="mb-6">
          <h2 className="text-xl font-bold mb-3">{section.category}</h2>
          {section.items.map((item, itemIndex) => (
            <CollapsibleSection key={itemIndex} title={item.title} count={item.count}>
              <MenuItem
                category={section.category}
                item={item}
                onCartUpdate={updateCartCount}
                unit={unit}
              />
            </CollapsibleSection>
          ))}
        </div>
      ))}

      {/* Sidebar */}
      {isSidebarOpen && (
        <div {...handlers} className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transition-transform transform translate-x-0">
          <Sidebar cartItems={cartItems} onClose={toggleSidebar} />
          {/* ChevronLeft for closing the sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute top-1/2 right-0 p-4 bg-gray-600 text-white rounded-l-lg shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Swipe Arrow */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-1/2 right-0 p-4 bg-blue-500 text-white rounded-l-lg shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default Menu;
