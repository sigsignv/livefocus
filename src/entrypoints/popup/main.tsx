import { render } from 'solid-js/web';
import { browser } from '#imports';
import App from '@/components/App';

async function getActiveTabId(): Promise<number> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0]?.id;
  if (!tabId) {
    throw new Error('Unable to get active tab id');
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
