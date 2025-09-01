import { render } from 'solid-js/web';
import { browser } from 'wxt/browser';
import App from '@/components/App';

async function getActiveTabId(): Promise<number> {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (tabs.length !== 1) {
    throw new Error('Unable to get active tab');
  }

  const tabId = tabs[0].id;
  if (typeof tabId !== 'number') {
    throw new Error('tabId is not a number');
  }

  return tabId;
}

const initialize = async () => {
  const tabId = await getActiveTabId();
  await browser.scripting.executeScript({
    target: { tabId },
    files: ['/content-scripts/content.js'],
  });

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('[LiveFocus] Root element not found');
  }

  render(() => <App tabId={tabId} />, root);
};

initialize().catch((err) => {
  console.error(err);
});
