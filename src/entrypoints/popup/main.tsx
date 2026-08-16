import { render } from "solid-js/web";
import { browser } from "#imports";
import App from "@/components/App";
import { getActiveTabInfo } from "@/utils/tab";

async function getActiveTabId(): Promise<number> {
  try {
    const tab = await getActiveTabInfo();
    return tab.id;
  } catch (error) {
    console.error("Failed fetching active tab info:", error);
    throw new Error("Unable to get active tab id");
  }
}

const tabId = await getActiveTabId();
await browser.scripting.executeScript({
  target: { tabId },
  files: ["/content-scripts/content.js"],
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("[LiveFocus] Root element not found");
}

render(() => <App tabId={tabId} />, root);
