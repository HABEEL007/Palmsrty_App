import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import './lib/env'; // Validate env vars at startup — throws if misconfigured

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root DOM element #root not found. Check public/index.html.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
