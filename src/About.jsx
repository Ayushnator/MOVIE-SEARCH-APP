import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { BrowserRouter } from 'react-router-dom'; // <-- Add this
    const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
    const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
