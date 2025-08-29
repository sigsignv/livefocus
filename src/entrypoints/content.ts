import { defineContentScript } from '#imports';
import { onMessage, removeAllListeners } from '@/utils/messaging';
import type { LiveFocusOptions } from '@/utils/option';
import { findOption, updateOption } from '@/utils/option';

declare global {
  interface Window {
    extLiveFocus: LiveFocusState;
  }
}

type LiveFocusState = {
  effectors: WeakMap<HTMLMediaElement, LiveFocusEffector>;
  options: LiveFocusOptions;
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

    const gain = findOption(options, 'gain');
    effector.nodes.gain.gain.value = gain?.value ?? 1.0;

    const panner = findOption(options, 'panner');
    effector.nodes.panner.pan.value = panner?.value ?? 0.0;

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
  main: (ctx) => {
    window.extLiveFocus ??= {
      effectors: new WeakMap(),
      options: [],
    };

    onMessage('getOptions', () => {
      const { options } = window.extLiveFocus;
      const gain = findOption(options, 'gain')?.value ?? 1.0;
      const panner = findOption(options, 'panner')?.value ?? 0.0;
      return { gain, panner };
    });

    onMessage('setGain', ({ data }) => {
      window.extLiveFocus.options = updateOption(window.extLiveFocus.options, data);
      applyOptions();
    });

    onMessage('setPan', ({ data }) => {
      window.extLiveFocus.options = updateOption(window.extLiveFocus.options, data);
      applyOptions();
    });

    onMessage('reset', () => {
      window.extLiveFocus.options = [];
      applyOptions();
    });

    ctx.onInvalidated(() => removeAllListeners());
  },
});
