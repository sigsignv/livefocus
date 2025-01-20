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

export type VoiceFocusAction = VoiceFocusApplyAction | VoiceFocusResetAction;

type VoiceFocusApplyAction = {
  action: 'apply';
  option: VoiceFocusOption;
};

type VoiceFocusResetAction = {
  action: 'reset';
};

export function isVoiceFocusAction(obj: unknown): obj is VoiceFocusAction {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.hasOwn(obj, 'action');
}

export type VoiceFocusOption = VoiceFocusGain;

type VoiceFocusGain = {
  type: 'gain';
  value: number;
};
