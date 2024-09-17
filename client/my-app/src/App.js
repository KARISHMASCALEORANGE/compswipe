import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import MenuItem from './MenuItem';        
import HomePage from './HomePage';
// import MyOrdersPage from './myorders';
import PaymentForm from './components/PaymentForm';

import OrderDashboard from './myorders';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path = "/home" element = {<HomePage/>}/>
        <Route path = "/menu" element = {<MenuItem/>}/>
        {/* <Route path="/orders" element={<MyOrdersPage />} /> */}
        <Route path = "/pay" element ={<PaymentForm/>}/>
        <Route path = "/OrderDashboard " element ={<OrderDashboard />}/>
     

      </Routes>
    </Router>
    </>
  );
}

export default App;


// import React, { useState, useEffect } from 'react';

// function App() {
//     const [data, setData] = useState(null);

//     useEffect(() => {
//         fetch('http://localhost:5000/api/data')
//             .then(response => response.json())
//             .then(data => setData(data))
//             .catch(error => console.error('Error fetching data:', error));
//     }, []);

//     return (
//         <div>
//             <h1>Data from JSON file1</h1>
//             {data ? (
//                 <pre>{JSON.stringify(data, null, 2)}</pre>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// }

// export default App;