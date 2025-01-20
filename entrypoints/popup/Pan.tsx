import type { VoiceFocusAction } from '@/utils/types';
import type React from 'react';
import { useCallback } from 'react';
import { getCurrentTabId } from './activeTab';

type Props = {
  pan?: number;
};

function Pan({ pan }: Props) {
  const onInput = useCallback<React.FormEventHandler<HTMLInputElement>>(async (ev) => {
    const { target } = ev;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const currentTabId = await getCurrentTabId();
    const message: VoiceFocusAction = {
      action: 'apply',
      option: { type: 'pan', value: Number(target.value) },
    };
    await browser.tabs.sendMessage(currentTabId, message);
  }, []);

  return (
    <div className="voicefocus container">
      <label htmlFor="pan">Panner:</label>
      <input
        type="range"
        id="pan"
        min={-1.0}
        max={1.0}
        step={0.1}
        list="default-pan"
        defaultValue={pan ?? 0.0}
        onInput={onInput}
      />
      <datalist id="default-pan">
        <option value="0.0" />
      </datalist>
    </div>
  );
}

export default Pan;
