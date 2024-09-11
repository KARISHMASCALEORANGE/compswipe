import React, {useState } from 'react';

const ProductCard = ({count,onIncrease,onDecrease}) => {
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState('kg');
  const [plates, setExtraPlates] = useState(false); 

 

  const increaseQuantity = () => {
    setQuantity(prevcount => {
      const newQuantity = prevcount + 1;
      onIncrease(newQuantity);
      return newQuantity;
    });
  };
  
  const decreaseQuantity = () => {
    if (quantity > 0) {
      setQuantity(prevcount => {
        const newQuantity = prevcount - 1;
        onDecrease(newQuantity);
        return newQuantity;
      });
    }
  };

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleCheckboxChange = () => {
    setExtraPlates(prev => !prev);
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center shadow-lg max-w-md mx-auto">
      <div className="w-1/3">
        <img src="biryani.jpg" alt="Product" className="w-24 h-24 object-cover rounded-lg" />
      </div>
      <div className="w-2/3 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 border p-1 rounded-lg">
            <label className={`cursor-pointer px-2 ${unit === 'kg' ? 'bg-red-500 text-white' : ''}`}>
              <input type="radio" name="unit" value="kg" checked={unit === 'kg'} onChange={handleUnitChange} className="hidden" />
              kg
            </label>
            <label className={`cursor-pointer px-2 ${unit === 'plate' ? 'bg-red-500 text-white' : ''}`}>
              <input type="radio" name="unit" value="plate" checked={unit === 'plate'} onChange={handleUnitChange} className="hidden" />
              plate
            </label>
          </div>
          <div className="text-lg font-bold">
            Biryani
          </div>
        </div>
        {unit === 'plate' && (
          <div className="flex justify-between items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={plates}
                onChange={handleCheckboxChange}
                className="w-4 h-4"
              />
              <span className="text-sm">plates</span>
            </label>
            <div className="text-xl font-bold">₹200</div>
          </div>
        )}
        {unit === 'kg' && (<div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={decreaseQuantity}
              className="text-lg font-bold border px-3 py-1 rounded-lg hover:bg-gray-200"
            >
              -
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="text-lg font-bold border px-3 py-1 rounded-lg hover:bg-gray-200"
            >
              +
            </button>
          </div>
          <div className="text-xl font-bold">₹200</div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;