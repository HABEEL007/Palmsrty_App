import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <div style={{ backgroundColor: '#0B0F1A', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1 style={{ color: '#7C3AED' }}>PALMSTRY AI</h1>
      <p>Simplified render test...</p>
    </div>
  );
} else {
  console.error('No root element');
}
