import { defineExtensionMessaging } from '@webext-core/messaging';
import type { FocusState } from './types';

interface LiveFocusMessaging {
  getOptions(): LiveFocusOptions;
  setGain(option: LiveFocusOption<number>): void;
  setPan(option: LiveFocusOption<number>): void;
  reset(): void;
}

type LiveFocusOptions = {
  gain: number;
  panner: number;
};

export type LiveFocusOption<T> = {
  state: FocusState;
  value: T;
};

export const { sendMessage, onMessage, removeAllListeners } =
  defineExtensionMessaging<LiveFocusMessaging>();
