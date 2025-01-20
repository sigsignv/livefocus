declare global {
  interface Window {
    extVoiceFocus: VoiceFocusMap;
  }
}

type VoiceFocusMap = WeakMap<HTMLMediaElement, VoiceFocusConfig>;

type VoiceFocusConfig = {
  context: AudioContext;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  sourceNode: MediaElementAudioSourceNode;

  options: VoiceFocusOption[];
};

const getPlayableElements = () => {
  return Array.from(document.querySelectorAll<HTMLMediaElement>('video, audio'));
};

const getVoiceFocusConfig = (key: HTMLMediaElement) => {
  const value = window.extVoiceFocus.get(key);
  if (value) {
    return value;
  }

  const ctx = new AudioContext();
  const gainNode = ctx.createGain();
  const pannerNode = ctx.createStereoPanner();
  const sourceNode = ctx.createMediaElementSource(key);

  sourceNode.connect(gainNode);
  gainNode.connect(pannerNode);
  pannerNode.connect(ctx.destination);

  return {
    context: ctx,
    gainNode,
    pannerNode,
    sourceNode,

    options: [],
  };
};

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  async main(): Promise<VoiceFocusState> {
    if (window.extVoiceFocus) {
      const keys = getPlayableElements();
      for (const key of keys) {
        const config = getVoiceFocusConfig(key);
        return { state: 'active', options: config.options };
      }

      return { state: 'active', options: [] };
    }

    window.extVoiceFocus = new WeakMap();

    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!sender.id || sender.id !== browser.runtime.id) {
        console.log('id is not match');
        return;
      }
      if (!isVoiceFocusAction(message)) {
        console.error('[VoiceFocus] Invalid message received:', message);
        return;
      }

      const keys = getPlayableElements();

      if (message.action === 'reset') {
        for (const key of keys) {
          const value = window.extVoiceFocus.get(key);
          if (value) {
            value.context.close().catch(console.error);
            window.extVoiceFocus.delete(key);
          }
        }
      }

      if (message.action === 'apply') {
        console.log(message);
        for (const key of keys) {
          const config = getVoiceFocusConfig(key);

          if (message.option.type === 'gain') {
            config.gainNode.gain.value = message.option.value;
          }

          if (message.option.type === 'pan') {
            config.pannerNode.pan.value = message.option.value;
          }

          config.options = config.options.filter((option) => {
            return option.type !== message.option.type;
          });
          config.options.push(message.option);

          window.extVoiceFocus.set(key, config);
        }
      }

      sendResponse('');
      return false;
    });

    return { state: 'ready' };
  },
});
