export const getCurrentTabId = async (): Promise<number> => {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  const tabId = tabs[0]?.id;
  if (!tabId) {
    throw new Error('[VoiceFocus] tabId is undefined');
  }

  return tabId;
};
