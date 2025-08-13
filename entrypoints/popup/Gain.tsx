import { getActiveTabId } from '@/utils/tabs';

type Props = {
  gain?: number;
};

function Gain(props: Props) {
  const onChange = async (ev: Event) => {
    const target = ev.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    const value = Number(target.value);
    if (Number.isNaN(value)) {
      return;
    }

    const currentTabId = await getActiveTabId();
    sendMessage('setGain', value, currentTabId);
  };

  return (
    <div class="container">
      <label for="gain">Gain:</label>
      <input
        type="range"
        id="gain"
        min={0.0}
        max={2.0}
        step={0.1}
        list="default-gain"
        value={props.gain ?? 1.0}
        onChange={onChange}
      />
      <datalist id="default-gain">
        <option value={1.0} />
      </datalist>
    </div>
  );
}

export default Gain;
