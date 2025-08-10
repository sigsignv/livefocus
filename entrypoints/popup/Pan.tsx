import { getCurrentTabId } from './activeTab';

type Props = {
  pan?: number;
};

function Pan({ pan }: Props) {
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
    sendMessage('apply', { type: 'pan', value }, currentTabId);
  };

  return (
    <div className="container">
      <label htmlFor="pan">Panner:</label>
      <input
        type="range"
        id="pan"
        min={-1.0}
        max={1.0}
        step={0.1}
        list="default-pan"
        defaultValue={pan ?? 0.0}
        onChange={onChange}
      />
      <datalist id="default-pan">
        <option value={-0.5} />
        <option value={0.0} />
        <option value={0.5} />
      </datalist>
    </div>
  );
}

export default Pan;
