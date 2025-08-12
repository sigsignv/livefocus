import { getActiveTabId } from '@/utils/tabs';

type Props = {
  gain?: number;
};

function Gain({ gain }: Props) {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (ev) => {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const value = Number(target.value);
    if (Number.isNaN(value)) {
      return;
    }

    const currentTabId = await getActiveTabId();
    sendMessage('apply', { type: 'gain', value }, currentTabId);
  };

  return (
    <div className="container">
      <label htmlFor="gain">Gain:</label>
      <input
        type="range"
        id="gain"
        min={0.0}
        max={2.0}
        step={0.1}
        list="default-gain"
        defaultValue={gain ?? 1.0}
        onChange={onChange}
      />
      <datalist id="default-gain">
        <option value={1.0} />
      </datalist>
    </div>
  );
}

export default Gain;
