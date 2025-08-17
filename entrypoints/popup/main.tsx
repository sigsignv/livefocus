import { render } from 'solid-js/web';
import { getActiveTabId } from '@/utils/tabs';
import App from './App';

const initialize = async () => {
  const tabId = await getActiveTabId();
  await browser.scripting.executeScript({
    target: { tabId },
    files: ['/content-scripts/content.js'],
  });

  const { gain, panner: pan } = await sendMessage('getOptions', undefined, tabId);

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('[LiveFocus] Root element not found');
  }

  render(() => <App gain={gain} pan={pan} tabId={tabId} />, root);
};

initialize().catch((err) => {
  console.error(err);
});
