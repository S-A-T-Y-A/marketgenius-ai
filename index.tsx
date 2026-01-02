
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Basic verification of environment on startup
if (typeof process !== 'undefined' && !process.env.API_KEY) {
  console.warn("MarketGenius AI: process.env.API_KEY is not defined. Ensure your .env.local file is configured correctly.");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
