import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getCurrentTabId } from './activeTab';

const initialize = async () => {
  const tabId = await getCurrentTabId();
  const results = await browser.scripting.executeScript<[], VoiceFocusState>({
    target: { tabId },
    files: ['/content-scripts/content.js'],
  });
  console.log('results', results);

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('[VoiceFocus] Root element not found');
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

initialize().catch((err) => {
  console.error(err);
});
