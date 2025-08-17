import { defineContentScript } from '#imports';
import { onMessage } from '@/utils/messaging';

declare global {
  interface Window {
    extLiveFocus: LiveFocusState;
  }
}

type LiveFocusState = {
  effectors: WeakMap<HTMLMediaElement, LiveFocusEffector>;
  options: {
    gain: number;
    panner: number;
  };
};

type LiveFocusEffector = {
  context: AudioContext;
  nodes: {
    source: MediaElementAudioSourceNode;
    gain: GainNode;
    panner: StereoPannerNode;
  };
};

function applyOptions() {
  const { effectors, options } = window.extLiveFocus;

  for (const track of document.querySelectorAll<HTMLMediaElement>('video, audio')) {
    const effector = effectors.get(track) ?? initEffector(track);

    effector.nodes.gain.gain.value = options.gain;
    effector.nodes.panner.pan.value = options.panner;

    effectors.set(track, effector);
  }
}

function initEffector(track: HTMLMediaElement): LiveFocusEffector {
  const context = new AudioContext();
  const source = context.createMediaElementSource(track);
  const gain = context.createGain();
  const panner = context.createStereoPanner();

  source.connect(gain);
  gain.connect(panner);
  panner.connect(context.destination);

  return {
    context,
    nodes: { source, gain, panner },
  };
}

export default defineContentScript({
  registration: 'runtime',
  main: () => {
    if (window.extLiveFocus) {
      return;
    }
    window.extLiveFocus = {
      effectors: new WeakMap(),
      options: {
        gain: 1.0,
        panner: 0.0,
      },
    };

    onMessage('getOptions', () => {
      return window.extLiveFocus.options;
    });

    onMessage('setGain', ({ data }) => {
      window.extLiveFocus.options.gain = data;
      applyOptions();
    });

    onMessage('setPan', ({ data }) => {
      window.extLiveFocus.options.panner = data;
      applyOptions();
    });

    onMessage('reset', () => {
      window.extLiveFocus.options = { gain: 1.0, panner: 0.0 };
      applyOptions();
    });
  },
});
