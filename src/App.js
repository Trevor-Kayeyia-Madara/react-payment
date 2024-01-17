import React from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import GuestForm from './components/GuestComponent';
import RoomComponent from './components/RoomComponent';
import TransactionComponent from './components/TransactionComponent';
import PaymentForm from './components/PaymentForm';


function App() {
  return (
    <>
    <Routes>
      <Route path = '/' element={<Home />}/>
      <Route path='/guest-booking' element={<GuestForm />}/>
      <Route path='/room-booking/:folioNumber' element={<RoomComponent />} /> {/* Updated route path */}
      <Route path='/transaction/:folioNumber' element={<TransactionComponent />} /> 
      <Route path='/payment-form/:folioNumber/:totalAmount' element={<PaymentForm />} />
      </Routes>
    </>
  );
}

export default App;
