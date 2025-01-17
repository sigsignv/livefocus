import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function initialize() {
  const root = document.getElementById('root');
  if (!root) {
    throw new Error('[VoiceFocus] Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

initialize();
