/**
 * @file App.tsx
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CaptureView } from './pages/CaptureView';
import { ProcessingView } from './pages/ProcessingView';
import { ResultView } from './pages/ResultView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative min-h-screen overflow-x-hidden">
        {/* Floating Particles Background */}
        <div className="particles-container">
          <div className="particle w-1 h-1 left-[10%] top-[20%]" />
          <div className="particle w-2 h-2 left-[30%] top-[50%]" />
          <div className="particle w-1 h-1 left-[70%] top-[10%]" />
          <div className="particle w-3 h-3 left-[85%] top-[80%]" />
          <div className="particle w-1 h-1 left-[50%] top-[40%]" />
        </div>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<CaptureView />} />
          <Route path="/processing" element={<ProcessingView />} />
          <Route path="/reading/:id" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
