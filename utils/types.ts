export type VoiceFocusState = VoiceFocusReady | VoiceFocusActive;

type VoiceFocusReady = {
  state: 'ready';
};

type VoiceFocusActive = {
  state: 'active';
  params: VoiceFocusParams[];
};

export function isVoiceFocusState(obj: unknown): obj is VoiceFocusState {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.hasOwn(obj, 'state');
}

export type VoiceFocusCommand = VoiceFocusApply | VoiceFocusReset;

type VoiceFocusApply = {
  command: 'apply';
  params: VoiceFocusParams[];
};

type VoiceFocusReset = {
  command: 'reset';
};

export function isVoiceFocusCommand(obj: unknown): obj is VoiceFocusCommand {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.hasOwn(obj, 'command');
}

export type VoiceFocusParams = VoiceFocusGain;

type VoiceFocusGain = {
  type: 'gain';
  value: number;
};

export function isVoiceFocusParameter(obj: unknown): obj is VoiceFocusParams {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return Object.hasOwn(obj, 'type');
}
