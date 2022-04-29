import { Tabs as BaseTabs } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TabsPropsSpec as BaseTabsPropsSpec } from '../generated/types/Tabs';
import { useEffect, useRef, useState } from 'react';
const TabsPropsSpec = Type.Object(BaseTabsPropsSpec);
const TabsStateSpec = Type.Object({
  activeTab: Type.String(),
});
const TabPane = BaseTabs.TabPane;

const exampleProperties: Static<typeof TabsPropsSpec> = {
  type: 'line',
  defaultActiveTab: '0',
  tabPosition: 'top',
  size: 'default',
  tabNames: ['Tab1', 'Tab2', 'Tab3'],
};

const options = {
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tabs',
    displayName: 'Tabs',
    exampleProperties,
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: TabsPropsSpec,
    state: TabsStateSpec,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
};

export const Tabs = implementRuntimeComponent(options)(props => {
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

  const slots = Array.isArray(slotsElements.content)
    ? slotsElements.content
    : [slotsElements.content];

  return (
    <BaseTabs
      className={css(customStyle?.content)}
      onChange={key => {
        setActiveTab(key);
        mergeState({ activeTab: key });
      }}
      {...cProps}
      activeTab={activeTab}
      ref={ref}
    >
      {tabNames.map((tabName, idx) => (
        <TabPane key={String(idx)} title={tabName}>
          {slots[idx]}
        </TabPane>
      ))}
    </BaseTabs>
  );
});
