import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Suppress Kaspersky antivirus console warnings (from browser extension, not our code)
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    // Filter out Kaspersky attribution reporting warnings
    if (message.includes('Attribution Reporting API') || 
        message.includes('kaspersky-labs.com')) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    // Filter out Kaspersky attribution reporting errors
    if (message.includes('Attribution Reporting API') || 
        message.includes('kaspersky-labs.com') ||
        message.includes('untrustworthy origin') && message.includes('kaspersky')) {
      return;
    }
    originalError.apply(console, args);
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
