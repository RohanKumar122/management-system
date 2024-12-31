import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { FirebaseProvider } from './context/firebase';
import Header from './pages/Header';
import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <Header />
        <App />
      </FirebaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
