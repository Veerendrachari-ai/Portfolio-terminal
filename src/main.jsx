// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css'; // Global CSS

// Select the root element in index.html
const rootElement = document.getElementById('root');

// Create React root and render App
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
