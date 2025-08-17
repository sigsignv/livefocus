export type VoiceFocusState = VoiceFocusReadyState | VoiceFocusActiveState;

type VoiceFocusReadyState = {
  state: 'ready';
};

type VoiceFocusActiveState = {
  state: 'active';
  options: VoiceFocusOption[];
};

export function isVoiceFocusState(obj: unknown): obj is VoiceFocusState {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.hasOwn(obj, 'state');
}

export type VoiceFocusOption = VoiceFocusGainOption | VoiceFocusPanOption;

type VoiceFocusGainOption = {
  type: 'gain';
  value: number;
};

type VoiceFocusPanOption = {
  type: 'pan';
  value: number;
};
