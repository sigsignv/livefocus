import { createSignal, onMount } from "solid-js";
import { sendMessage } from "@/utils/messaging";
import type { ActiveTabInfo } from "@/utils/tab";

import Gain from "./Gain";
import Pan from "./Pan";
import TabInfo from "./TabInfo";

type Props = {
  activeTabInfo: ActiveTabInfo;
};

function App(props: Props) {
  const tabId = () => props.activeTabInfo.id;
  const [gain, setGain] = createSignal(1.0);
  const [pan, setPan] = createSignal(0.0);

  onMount(async () => {
    const { gain, panner } = await sendMessage(
      "getOptions",
      undefined,
      tabId(),
    );
    setGain(gain);
    setPan(panner);
  });

  const onClick = () => {
    setGain(1.0);
    setPan(0.0);
  };

  const onReset = async () => {
    await sendMessage("reset", undefined, tabId());
  };

  return (
    <form onReset={onReset}>
      {props.activeTabInfo.kind === "split-view" && (
        <TabInfo tab={props.activeTabInfo} />
      )}
      <div class="container">
        <input type="reset" onClick={onClick} />
      </div>
      <Gain gain={gain()} state="focus" tabId={tabId()} />
      <Pan pan={pan()} state="focus" tabId={tabId()} />
    </form>
  );
}

export default App;
