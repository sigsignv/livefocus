import { getCurrentTabId } from './activeTab';
import Gain from './Gain';
import Pan from './Pan';

type Props = {
  gain?: number;
  pan?: number;
};

function App(props: Props) {
  const [gain, setGain] = useState(props.gain);
  const [pan, setPan] = useState(props.pan);

  const onClick = () => {
    setGain(1.0);
    setPan(0.0);
  };

  const onReset = async () => {
    const currentTabId = await getCurrentTabId();
    await sendMessage('reset', undefined, currentTabId);
  };

  return (
    <form onReset={onReset}>
      <Gain gain={gain} />
      <Pan pan={pan} />
      <div className="container">
        <input type="reset" onClick={onClick} />
      </div>
    </form>
  );
}

export default App;
