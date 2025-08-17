import { defineExtensionMessaging } from '@webext-core/messaging';

interface LiveFocusMessaging {
  getOptions(): LiveFocusOptions;
  setGain(value: number): void;
  setPan(value: number): void;
  reset(): void;
}

type LiveFocusOptions = {
  gain: number;
  panner: number;
};

export const { sendMessage, onMessage } = defineExtensionMessaging<LiveFocusMessaging>();
