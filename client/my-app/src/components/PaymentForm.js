import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/pay', {
        userid: userId,
        amount: amount,
      });

      // Check if the response contains the redirect URL
      if (response.data && response.data.redirectUrl) {
        setRedirectUrl(response.data.redirectUrl);
        // Redirect to the provided URL
        window.location.href = response.data.redirectUrl;
      } else {
        setError('Unexpected response format.');
      }
    } catch (err) {
      // Check for specific error details
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'An error occurred. Please try again.'}`);
      } else {
        setError('Network error or no response from the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Make a Payment</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userId" className="block text-gray-700 font-semibold mb-2">User ID</label>
            <input
              id="userId"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-gray-700 font-semibold mb-2">Amount (in Rupees)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 text-white font-semibold rounded-md ${loading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
