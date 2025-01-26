import Compressor from './Compressor';
import Gain from './Gain';
import Pan from './Pan';
import { getCurrentTabId } from './activeTab';

type Props = {
  gain?: number;
  pan?: number;
  threshold?: number;
};

function App(props: Props) {
  const [gain, setGain] = useState(props.gain);
  const [pan, setPan] = useState(props.pan);
  const [threshold, setThreshold] = useState(props.threshold);

  const onClick = () => {
    setGain(1.0);
    setPan(0.0);
    setThreshold(0);
  };

  const onReset = async () => {
    const currentTabId = await getCurrentTabId();
    await browser.tabs.sendMessage<VoiceFocusAction>(currentTabId, {
      action: 'reset',
    });
  };

  return (
    <form onReset={onReset}>
      <Gain gain={gain} />
      <Pan pan={pan} />
      <Compressor threshold={threshold} />
      <div className="container">
        <input type="reset" onClick={onClick} />
      </div>
    </form>
  );
}

export default App;
