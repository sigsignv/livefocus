import { browser } from 'wxt/browser';

export async function getActiveTabId(): Promise<number> {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (tabs.length !== 1) {
    throw new Error('[LiveFocus] Unable to get active tab');
  }

  const tabId = tabs[0].id;
  if (typeof tabId !== 'number') {
    throw new Error('[LiveFocus] tabId is not a number');
  }

  return tabId;
}
