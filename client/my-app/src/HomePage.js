import React from 'react';
import { User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const plates = form.elements['plates'].value;

    if (!form.checkValidity()) {
      form.reportValidity();
    } else {
      navigate('/menu', { state: { numberOfPlates: plates } }); // Pass plates count via state
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#008000] to-[#70c656] min-h-screen p-4 font-sans">
      <div className="flex justify-end mb-6">
        <div className="bg-white rounded-full p-2">
          <User size={24} className="text-gray-600" />
        </div>
      </div>

      <h2 className="text-blue-500 text-lg font-semibold mb-6 text-center">
        Know Availability to your Location
      </h2>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Name is required"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone No</label>
              <input
                type="tel"
                placeholder="Enter your number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Phone number is required"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Delivery Location</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
                title="Delivery location is required"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Enter no of plates</label>
              <input
                type="number"
                name="plates"
                placeholder="e.g., 300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                title="Number of plates is required and must be at least 1"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;