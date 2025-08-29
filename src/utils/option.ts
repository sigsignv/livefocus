type AudioNodeMap = {
  gain: number;
  panner: number;
};

export type AudioNodeType = keyof AudioNodeMap;

export type LiveFocusOption<T extends AudioNodeType> = {
  kind: T;
  value: AudioNodeMap[T];

  /**
   * Unused.
   */
  state: unknown;
};

export type LiveFocusOptions = LiveFocusOption<AudioNodeType>[];

export function findOption<T extends AudioNodeType>(array: LiveFocusOptions, kind: T) {
  return array.find((option): option is LiveFocusOption<T> => option.kind === kind) ?? null;
}

export function updateOption<T extends AudioNodeType>(
  array: LiveFocusOptions,
  option: LiveFocusOption<T>,
) {
  const options = array.filter((o) => o.kind !== option.kind);
  return [...options, option];
}
