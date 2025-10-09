import { createSignal, onMount } from 'solid-js';
import { sendMessage } from '@/utils/messaging';

import Gain from './Gain';
import Pan from './Pan';

type Props = {
  tabId: number;
};

function App(props: Props) {
  const [gain, setGain] = createSignal(1.0);
  const [pan, setPan] = createSignal(0.0);

  onMount(async () => {
    const { gain, panner } = await sendMessage('getOptions', undefined, props.tabId);
    setGain(gain);
    setPan(panner);
  });

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
      <Gain gain={gain()} state="focus" tabId={props.tabId} />
      <Pan pan={pan()} state="focus" tabId={props.tabId} />
    </form>
  );
}

export default App;
