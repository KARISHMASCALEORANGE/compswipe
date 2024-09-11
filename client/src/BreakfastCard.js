import React, { useState } from 'react';

const BreakfastCard = () => {
  const [plates, setExtraPlates] = useState(false);

  const handleCheckboxChange = () => {
    setExtraPlates((prev) => !prev);
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center shadow-lg max-w-md mx-auto">
      <div className="flex w-full items-center">
        {/* Image on the left */}
        <div className="w-1/3">
          <img src="biryani.jpg" alt="Product" className="w-24 h-24 object-cover rounded-lg" />
        </div>
        
        {/* Middle content (Extra plates) */}
        <div className="w-1/3 flex flex-col items-center">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={plates}
              onChange={handleCheckboxChange}
              className="w-4 h-4"
            />
            <span className="text-sm">Extra plates</span>
          </label>
        </div>
        
        {/* Right content (Biryani and Price) */}
        <div className="w-1/3 flex flex-col justify-between items-end">
          <div className="flex justify-end items-center mb-4">
            <div className="text-lg font-bold">Biryani</div>
          </div>
          <div className="text-xl font-bold">₹200</div>
        </div>
      </div>
    </div>
  );
};

export default BreakfastCard;