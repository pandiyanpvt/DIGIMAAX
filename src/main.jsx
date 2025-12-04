import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Suppress browser extension console errors (from extensions, not our code)
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    const stack = args.join(' ') || '';
    // Filter out extension warnings
    if (message.includes('Attribution Reporting API') || 
        message.includes('kaspersky-labs.com') ||
        message.includes('quillbot') ||
        stack.includes('quillbot-content.js')) {
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    const stack = args.join(' ') || '';
    // Filter out extension errors
    if (message.includes('Attribution Reporting API') || 
        message.includes('kaspersky-labs.com') ||
        message.includes('untrustworthy origin') && message.includes('kaspersky') ||
        message.includes('chrome-extension://invalid/') ||
        message.includes('net::ERR_FAILED') && stack.includes('quillbot') ||
        stack.includes('quillbot-content.js') ||
        stack.includes('detectCompetitorExtensions')) {
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
