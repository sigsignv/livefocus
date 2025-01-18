import type { VoiceFocusCommand } from '@/utils/types';
import type React from 'react';
import { useCallback } from 'react';
import { getCurrentTabId } from './activeTab';

type Props = {
  gain?: number;
};

function Gain({ gain }: Props) {
  const onInput = useCallback<React.FormEventHandler<HTMLInputElement>>(async (ev) => {
    const { target } = ev;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const currentTabId = await getCurrentTabId();
    const message: VoiceFocusCommand = {
      command: 'apply',
      params: [{ type: 'gain', value: Number(target.value) }],
    };
    const response = await browser.tabs.sendMessage(currentTabId, message);
  }, []);

  return (
    <div className="voicefocus container">
      <label htmlFor="gain">Gain:</label>
      <input
        type="range"
        id="gain"
        min={0.0}
        max={2.0}
        step={0.05}
        list="default-gain"
        defaultValue={gain ?? 1.0}
        onInput={onInput}
      />
      <datalist id="default-gain">
        <option value="1.0" />
      </datalist>
    </div>
  );
}

export default Gain;
