import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { FarmerProvider } from './context/FarmerContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <FarmerProvider>
        <App />
      </FarmerProvider>
    </LanguageProvider>
  </React.StrictMode>
);
