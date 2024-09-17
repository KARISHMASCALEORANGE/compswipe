import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SuccessPage from './components/SuccessPage'; // Import your SuccessPage component
import PaymentForm from './components/PaymentForm';
import FailurePage from './components/Failurepage';
import PendingPage from './components/PendingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<PaymentForm/>} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/pending" element={<PendingPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;