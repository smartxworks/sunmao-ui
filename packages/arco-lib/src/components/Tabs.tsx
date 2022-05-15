import { Tabs as BaseTabs } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TabsPropsSpec as BaseTabsPropsSpec } from '../generated/types/Tabs';
import { useEffect, useRef, useState } from 'react';

const TabsPropsSpec = Type.Object(BaseTabsPropsSpec);
const TabsStateSpec = Type.Object({
  activeTab: Type.Number(),
});
const TabPane = BaseTabs.TabPane;

const exampleProperties: Static<typeof TabsPropsSpec> = {
  type: 'line',
  defaultActiveTab: 0,
  tabPosition: 'top',
  size: 'default',
  tabNames: ['Tab1', 'Tab2', 'Tab3'],
};

export const Tabs = implementRuntimeComponent({
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
    methods: {
      setActiveTab: Type.Object({
        activeTab: Type.Number(),
      }),
    },
    slots: {
      content: {
        slotProps: Type.Object({
          tabIndex: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: [],
  },
})(props => {
  const { defaultActiveTab, tabNames, ...cProps } = getComponentProps(props);
  const { getElement, customStyle, mergeState, subscribeMethods, slotsElements } = props;
  const ref = useRef<{ current: HTMLDivElement }>(null);
  const [activeTab, setActiveTab] = useState<number>(defaultActiveTab ?? 0);

  useEffect(() => {
    mergeState({ activeTab: defaultActiveTab });
  }, []);

  useEffect(() => {
    const ele = ref.current?.current;
    if (getElement && ele) {
      getElement(ele);
    }
  }, [getElement, ref]);

  useEffect(() => {
    subscribeMethods({
      setActiveTab: ({ activeTab }) => {
        setActiveTab(activeTab);
        mergeState({ activeTab });
      },
    });
  });

  return (
    <BaseTabs
      className={css(customStyle?.content)}
      onChange={key => {
        setActiveTab(Number(key));
        mergeState({ activeTab: Number(key) });
      }}
      {...cProps}
      activeTab={String(activeTab)}
      ref={ref}
    >
      {tabNames.map((tabName, idx) => (
        <TabPane key={String(idx)} title={tabName}>
          {slotsElements?.content
            ? slotsElements.content({
                tabIndex: idx,
              })
            : null}
        </TabPane>
      ))}
    </BaseTabs>
  );
});
