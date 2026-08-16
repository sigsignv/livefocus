import type { ActiveTabInfo } from "@/utils/tab";

import "./TabInfo.css";

type SplitViewTabInfo = Extract<ActiveTabInfo, { kind: "split-view" }>;

type Props = {
  tab: SplitViewTabInfo;
};

function TabInfo(props: Props) {
  return (
    <section class="tab-info" aria-label="Active tab in split view">
      <div class="tab-info__content">
        {props.tab.favIconUrl && (
          <img
            class="tab-info__favicon"
            src={props.tab.favIconUrl}
            alt=""
            width={20}
            height={20}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        )}
        <div class="tab-info__text">
          <div class="tab-info__title" title={props.tab.title}>
            {props.tab.title}
          </div>
          <div class="tab-info__hostname" title={props.tab.hostname}>
            {props.tab.hostname}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TabInfo;
