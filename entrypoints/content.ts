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

  enable() {
    if (!this.source) {
      return;
    }

    for (const option of this.options) {
      this.apply(option);
    }

    if (!this.isEnabled) {
      this.source.disconnect();
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.pannerNode);
      this.pannerNode.connect(this.context.destination);
      this.isEnabled = true;
    }
  }

  disable() {
    if (!this.source) {
      return;
    }

    if (this.isEnabled) {
      this.source.disconnect();
      this.source.connect(this.context.destination);
      this.gainNode.disconnect();
      this.pannerNode.disconnect();
      this.isEnabled = false;
    }
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

    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!sender.id || sender.id !== browser.runtime.id) {
        return;
      }
      if (!isVoiceFocusAction(message)) {
        console.error('[VoiceFocus] Invalid message received:', message);
        return;
      }

      if (message.action === 'reset') {
        for (const key of getPlayableElements()) {
          const config = window.extVoiceFocus.get(key);
          if (config) {
            config.disable();
            config.reset();
          }
        }
      }

      if (message.action === 'apply') {
        for (const key of getPlayableElements()) {
          const config = window.extVoiceFocus.get(key) ?? new VoiceFocusConfig(key);
          config.apply(message.option);
          config.enable();
          window.extVoiceFocus.set(key, config);
        }
      }
    });

    return { state: 'ready' };
  },
});
