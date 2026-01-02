
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global shim for process.env to support browser-based execution of Node-style code
const globalAny = window as any;
globalAny.process = globalAny.process || {};
globalAny.process.env = globalAny.process.env || {};

// Verification logic for development debugging
if (!process.env.API_KEY) {
  console.error(
    "MarketGenius AI: process.env.API_KEY is missing. " +
    "If running locally, ensure your dev server (e.g., Vite) is configured to define process.env.API_KEY " +
    "or check your .env.local file. "
  );
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
