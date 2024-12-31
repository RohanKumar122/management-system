import './App.css';
import {Routes, Route} from 'react-router-dom';
import RegisterForm from './pages/Register';
import LoginForm from './pages/login';
import ItemListing from './pages/ItemListing';
import Home from './pages/Home';
import AdminRoute from './pages/AdminRoute';
import React from 'react';

console.log(process.env.REACT_APP_FIREBASE_API_KEY);
console.log(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);



function App() {
  return (
    
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/listBooks" element={<ItemListing />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/admin" element={<AdminRoute />} /> {/* Admin route */}
    </Routes>
  );
}

export default App;
