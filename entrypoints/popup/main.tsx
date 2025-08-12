import { render } from 'solid-js/web';
import { getActiveTabId } from '@/utils/tabs';
import App from './App';

const pickOption = <T extends VoiceFocusOption['type']>(
  options: VoiceFocusOption[],
  name: T,
  defaultValue: Extract<VoiceFocusOption, { type: T }>['value'],
) => {
  for (const option of options) {
    if (option.type === name) {
      return option.value;
    }
  }
  return defaultValue;
};

const initialize = async () => {
  const tabId = await getActiveTabId();
  const results = await browser.scripting.executeScript<[], VoiceFocusState>({
    target: { tabId },
    files: ['/content-scripts/content.js'],
  });

  const r = results[0];
  const gain = r?.result?.state === 'active' ? pickOption(r.result.options, 'gain', 1) : 1;
  const pan = r?.result?.state === 'active' ? pickOption(r.result.options, 'pan', 0) : 0;

  const root = document.getElementById('root');
  if (!root) {
    throw new Error('[VoiceFocus] Root element not found');
  }

  render(() => <App gain={gain} pan={pan} />, root);
};

initialize().catch((err) => {
  console.error(err);
});
