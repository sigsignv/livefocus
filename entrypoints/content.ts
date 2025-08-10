declare global {
  interface Window {
    extVoiceFocus: VoiceFocusMap;
  }
}

type VoiceFocusMap = WeakMap<HTMLMediaElement, VoiceFocusConfig>;

const createMediaElementSource = (ctx: AudioContext, media: HTMLMediaElement) => {
  return new Promise<MediaElementAudioSourceNode>((resolv, reject) => {
    const listener = (ev: Event) => {
      try {
        resolv(ctx.createMediaElementSource(ev.target as HTMLMediaElement));
      } catch (ex) {
        reject(ex);
      }
    };
    media.addEventListener('timeupdate', listener, { once: true });
  });
};

const getPlayableElements = () => {
  return Array.from(document.querySelectorAll<HTMLMediaElement>('video, audio'));
};

class VoiceFocusConfig {
  context: AudioContext;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  source?: MediaElementAudioSourceNode;

  options: VoiceFocusOption[];
  isEnabled: boolean;

  constructor(media: HTMLMediaElement) {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.pannerNode = this.context.createStereoPanner();

    createMediaElementSource(this.context, media)
      .then((source) => {
        source.connect(this.context.destination);
        this.source = source;
      })
      .catch((err) => {
        console.error(err);
      });

    this.options = [];
    this.isEnabled = false;
  }

  apply(option: VoiceFocusOption) {
    this.options = this.options.filter((o) => o.type !== option.type);

    if (option.type === 'gain') {
      this.gainNode.gain.value = option.value;
    }
    if (option.type === 'pan') {
      this.pannerNode.pan.value = option.value;
    }

    this.options.push(option);
  }

  connect() {
    if (!this.source) {
      return;
    }

    // Reset connections between all AudioNodes
    this.disconnect();
    this.source.disconnect();

    let lastNode: AudioNode = this.source;
    for (const node of this.getAudioNodes()) {
      lastNode = lastNode.connect(node);
    }
    lastNode.connect(this.context.destination);
  }

  disconnect() {
    if (!this.source) {
      return;
    }

    // Connect the audio source directly to the output, bypassing other nodes
    this.source.disconnect();
    this.source.connect(this.context.destination);

    for (const node of this.getAudioNodes()) {
      node.disconnect();
    }
  }

  enable() {
    if (!this.source) {
      return;
    }

    for (const option of this.options) {
      this.apply(option);
    }

    if (!this.isEnabled) {
      this.connect();
      this.isEnabled = true;
    }
  }

  disable() {
    if (!this.source) {
      return;
    }

    if (this.isEnabled) {
      this.disconnect();
      this.isEnabled = false;
    }
  }

  getAudioNodes(): AudioNode[] {
    const nodes = [this.gainNode, this.pannerNode];

    return nodes;
  }

  reset() {
    this.gainNode.gain.value = 1.0;
    this.pannerNode.pan.value = 0.0;
    this.options = [];
  }
}

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  async main(): Promise<VoiceFocusState> {
    if (window.extVoiceFocus) {
      for (const key of getPlayableElements()) {
        const config = window.extVoiceFocus.get(key);
        if (config) {
          return { state: 'active', options: config.options };
        }
      }
      return { state: 'active', options: [] };
    }

    window.extVoiceFocus = new WeakMap();

    onMessage('reset', () => {
      for (const key of getPlayableElements()) {
        const config = window.extVoiceFocus.get(key);
        if (config) {
          config.disable();
          config.reset();
        }
      }
    });

    onMessage('apply', (message) => {
      const option = message.data;
      for (const key of getPlayableElements()) {
        const config = window.extVoiceFocus.get(key) ?? new VoiceFocusConfig(key);
        config.apply(option);
        config.enable();
        window.extVoiceFocus.set(key, config);
      }
    });

    return { state: 'ready' };
  },
});
