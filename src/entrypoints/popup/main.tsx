import { render } from 'solid-js/web';
import { browser } from 'wxt/browser';
import App from '@/components/App';
import { getActiveTabId } from '@/utils/tabs';

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
