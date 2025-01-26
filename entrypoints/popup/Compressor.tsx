import { getCurrentTabId } from './activeTab';

type Props = {
  threshold?: number;
};

function Compressor({ threshold }: Props) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (ev) => {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const value = Number(target.value);
    if (Number.isNaN(value)) {
      return;
    }

    const currentTabId = await getCurrentTabId();
    await browser.tabs.sendMessage<VoiceFocusAction>(currentTabId, {
      action: 'apply',
      option: { type: 'compressor', value },
    });
  };

  return (
    <div className="container">
      <label htmlFor="compressor">Compressor:</label>
      <input
        type="range"
        id="compressor"
        min={-60}
        max={0}
        step={2}
        defaultValue={threshold ?? 0}
        onChange={onChange}
      />
    </div>
  );
}

export default Compressor;
