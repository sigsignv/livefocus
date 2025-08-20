export type FocusState = 'focus' | 'blur';

type LiveFocusAudioNodeType = {
  gain: number;
  panner: number;
};

export type LiveFocusOption<T extends keyof LiveFocusAudioNodeType> = {
  kind: T;
  state: FocusState;
  value: LiveFocusAudioNodeType[T];
};
