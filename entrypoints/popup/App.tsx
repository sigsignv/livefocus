import { getActiveTabId } from '@/utils/tabs';
import Gain from './Gain';
import Pan from './Pan';

type Props = {
  gain?: number;
  pan?: number;
};

function App(props: Props) {
  const [gain, setGain] = createSignal(props.gain ?? 1.0);
  const [pan, setPan] = createSignal(props.pan ?? 0.0);

  const onClick = () => {
    setGain(1.0);
    setPan(0.0);
  };

  const onReset = async () => {
    const currentTabId = await getActiveTabId();
    await sendMessage('reset', undefined, currentTabId);
  };

  return (
    <form onReset={onReset}>
      <Gain gain={gain()} />
      <Pan pan={pan()} />
      <div class="container">
        <input type="reset" onClick={onClick} />
      </div>
    </form>
  );
}

export default App;
