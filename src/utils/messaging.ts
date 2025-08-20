import { defineExtensionMessaging } from '@webext-core/messaging';
import type { LiveFocusOption } from './types';

interface LiveFocusMessaging {
  getOptions(): LiveFocusOptions;
  setGain(option: LiveFocusOption<'gain'>): void;
  setPan(option: LiveFocusOption<'panner'>): void;
  reset(): void;
}

type LiveFocusOptions = {
  gain: number;
  panner: number;
};

export const { sendMessage, onMessage, removeAllListeners } =
  defineExtensionMessaging<LiveFocusMessaging>();
