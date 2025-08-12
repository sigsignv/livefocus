import { getActiveTabId } from '@/utils/tabs';

type Props = {
  pan?: number;
};

function Pan(props: Props) {
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
    sendMessage('apply', { type: 'pan', value }, currentTabId);
  };

  return (
    <div class="container">
      <label for="pan">Panner:</label>
      <input
        type="range"
        id="pan"
        min={-1.0}
        max={1.0}
        step={0.1}
        list="default-pan"
        value={props.pan ?? 0.0}
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
