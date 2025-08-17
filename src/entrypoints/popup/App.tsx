import { createSignal } from 'solid-js';
import { sendMessage } from '@/utils/messaging';

import Gain from './Gain';
import Pan from './Pan';

type Props = {
  gain?: number;
  pan?: number;
  tabId: number;
};

function App(props: Props) {
  const [gain, setGain] = createSignal(props.gain ?? 1.0);
  const [pan, setPan] = createSignal(props.pan ?? 0.0);

  const onClick = () => {
    setGain(1.0);
    setPan(0.0);
  };

  const onReset = async () => {
    await sendMessage('reset', undefined, props.tabId);
  };

  return (
    <form onReset={onReset}>
      <div class="container">
        <input type="reset" onClick={onClick} />
      </div>
      <Gain gain={gain()} tabId={props.tabId} />
      <Pan pan={pan()} tabId={props.tabId} />
    </form>
  );
}

export default App;
