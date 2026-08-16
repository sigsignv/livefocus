import { render } from "solid-js/web";
import { browser } from "#imports";
import App from "@/components/App";
import type { ActiveTabInfo } from "@/utils/tab";
import { getActiveTabInfo } from "@/utils/tab";

async function fetchActiveTabInfo(): Promise<ActiveTabInfo> {
  try {
    return await getActiveTabInfo();
  } catch (error) {
    throw new Error("Unable to get active tab info", { cause: error });
  }
}

const activeTabInfo = await fetchActiveTabInfo();
await browser.scripting.executeScript({
  target: { tabId: activeTabInfo.id },
  files: ["/content-scripts/content.js"],
});

const root = document.getElementById("root");
if (!root) {
  throw new Error("[LiveFocus] Root element not found");
}

render(() => <App activeTabInfo={activeTabInfo} />, root);
