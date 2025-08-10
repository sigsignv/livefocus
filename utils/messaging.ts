import { defineExtensionMessaging } from '@webext-core/messaging';
import type { VoiceFocusOption } from './types';

interface LiveFocusMessaging {
  apply(option: VoiceFocusOption): void;
  reset(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<LiveFocusMessaging>();
