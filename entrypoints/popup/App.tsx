import Gain from './Gain';
import Pan from './Pan';

type Props = {
  gain?: number;
  pan?: number;
};

function App({ gain, pan }: Props) {
  return (
    <>
      <Gain gain={gain} />
      <Pan pan={pan} />
    </>
  );
}

export default App;
