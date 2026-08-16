import * as v from "valibot";
import { browser } from "#imports";

export type ActiveTabInfo =
  | {
      kind: "normal";
      id: number;
    }
  | {
      kind: "split-view";
      id: number;
      title: string;
      hostname: string;
      favIconUrl?: string;
    };

const TabSchema = v.object({
  id: v.pipe(
    v.number(),
    v.check((id) => id !== browser.tabs.TAB_ID_NONE, "No active tab found"),
  ),
  title: v.string(),
  url: v.pipe(
    v.string(),
    v.url(),
    v.transform((url) => new URL(url)),
  ),
  favIconUrl: v.optional(
    v.pipe(
      v.string(),
      v.transform((url) => (url === "" ? undefined : url)),
    ),
  ),
  splitViewId: v.optional(v.number()),
});

export async function getActiveTabInfo(): Promise<ActiveTabInfo> {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  const activeTab = v.parse(TabSchema, tab);

  if (isSplitView(activeTab.splitViewId)) {
    return {
      kind: "split-view",
      id: activeTab.id,
      title: activeTab.title,
      hostname: activeTab.url.hostname || "",
      favIconUrl: activeTab.favIconUrl,
    };
  }

  return {
    kind: "normal",
    id: activeTab.id,
  };
}

function isSplitView(splitViewId: number | undefined): boolean {
  if (typeof splitViewId !== "number") {
    return false;
  }
  if (typeof browser.tabs.SPLIT_VIEW_ID_NONE !== "number") {
    return false;
  }

  return splitViewId !== browser.tabs.SPLIT_VIEW_ID_NONE;
}
