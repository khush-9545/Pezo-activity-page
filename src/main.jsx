import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import PlaceOrder from './PlaceOrder.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/Pezo-activity-page">
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/place-order" element={<PlaceOrder />} />
      {/* Optional: catch-all route for debugging */}
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  </BrowserRouter>
);
