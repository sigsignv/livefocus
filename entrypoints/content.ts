declare global {
  interface Window {
    extVoiceFocus?: string;
  }
}

export type ContentScriptState = {
  type: 'state';
  state: 'pending' | 'running' | 'finished';
};

export default defineContentScript({
  registration: 'runtime',
  matches: [],
  async main(): Promise<ContentScriptState> {
    const playableElements = Array.from(document.querySelectorAll('video, audio'));
    if (playableElements.length === 0) {
      return { type: 'state', state: 'pending' };
    }

    if (window.extVoiceFocus) {
      return { type: 'state', state: 'running' };
    }
    window.extVoiceFocus = 'running';

    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('contentscript message received: ', message);
      sendResponse('from contentscript');

      return false;
    });

    console.log('Running content script...');
    return { type: 'state', state: 'running' };
  },
});
