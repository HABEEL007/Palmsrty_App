/**
 * @file main.tsx
 * @description Application entry point. Handles React Root initialization.
 * Imports global Tailwind configuration from ./index.css.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css'; 

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Initialization Error: Root mounting target #root missing from DOM.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
