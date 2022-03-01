import { Tabs as BaseTabs } from "@arco-design/web-react";
import { ComponentImpl, implementRuntimeComponent } from "@sunmao-ui/runtime";
import { css } from "@emotion/css";
import { Type, Static } from "@sinclair/typebox";
import { FALLBACK_METADATA, getComponentProps } from "../sunmao-helper";
import { TabsPropsSchema as BaseTabsPropsSchema } from "../generated/types/Tabs";
import React, { useEffect, useRef, useState } from "react";
const TabsPropsSchema = Type.Object(BaseTabsPropsSchema);
const TabsStateSchema = Type.Object({
  activeTab: Type.String(),
});
const TabPane = BaseTabs.TabPane;

const TabsImpl: ComponentImpl<Static<typeof TabsPropsSchema>> = (props) => {
  const { defaultActiveTab, tabNames, ...cProps } = getComponentProps(props);
  const { getElement, customStyle, mergeState, slotsElements } = props;
  const ref = useRef<{ current: HTMLDivElement }>(null);
  const [activeTab, setActiveTab] = useState<string>(String(defaultActiveTab));

  useEffect(() => {
    const ele = ref.current?.current;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  return (
    <BaseTabs
      className={css(customStyle?.content)}
      onChange={(key) => {
        setActiveTab(key);
        mergeState({ activeTab: key });
      }}
      {...cProps}
      activeTab={activeTab}
      ref={ref}
    >
      {tabNames.map((tabName, idx) => (
        <TabPane key={String(idx)} title={tabName}>
          {([] as React.ReactElement[]).concat(slotsElements.content)[idx]}
        </TabPane>
      ))}
    </BaseTabs>
  );
};

const exampleProperties: Static<typeof TabsPropsSchema> = {
  type: "capsule",
  defaultActiveTab: "1",
  tabPosition: "bottom",
  size: "default",
  tabNames: ["Tab1", "Tab2", "Tab3"],
};

const options = {
  version: "arco/v1",
  metadata: {
    ...FALLBACK_METADATA,
    name: "tabs",
    displayName: "Tabs",
    exampleProperties,
    annotations: {
      category: "Display",
    },
  },
  spec: {
    properties: TabsPropsSchema,
    state: TabsStateSchema,
    methods: {},
    slots: ["content"],
    styleSlots: ["content"],
    events: [],
  },
};

export const Tabs = implementRuntimeComponent(options)(TabsImpl);
