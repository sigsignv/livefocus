declare global {
  interface Window {
    extVoiceFocus?: WeakMap<HTMLMediaElement, string>;
  }
}

const getPlayableElements = () => {
  return Array.from(document.querySelectorAll<HTMLMediaElement>('video, audio'));
};

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  async main(): Promise<VoiceFocusState> {
    if (window.extVoiceFocus) {
      return { state: 'active', params: [] };
    }

    window.extVoiceFocus = new WeakMap();

    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (!isVoiceFocusCommand(message)) {
        return;
      }
      console.log(message);
      sendResponse('');
      return false;
    });

    return { state: 'ready' };
  },
});
