import { Tabs as BaseTabs } from '@arco-design/web-react';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';
import { Type, Static } from '@sinclair/typebox';
import { FALLBACK_METADATA, getComponentProps } from '../sunmao-helper';
import { TabsPropsSpec as BaseTabsPropsSpec } from '../generated/types/Tabs';
import { useEffect, useRef } from 'react';
import { useStateValue } from '../hooks/useStateValue';

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
  updateWhenDefaultValueChanges: false,
  tabs: [
    {
      title: 'Tab 1',
      hidden: false,
      destroyOnHide: true,
    },
    {
      title: 'Tab 2',
      hidden: false,
      destroyOnHide: true,
    },
    {
      title: 'Tab 3',
      hidden: false,
      destroyOnHide: true,
    },
  ],
};

export const Tabs = implementRuntimeComponent({
  version: 'arco/v1',
  metadata: {
    ...FALLBACK_METADATA,
    name: 'tabs',
    displayName: 'Tabs',
    exampleProperties,
    annotations: {
      category: 'Data Display',
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
    events: ['onChange', 'onClickTab'],
  },
})(props => {
  const { defaultActiveTab, updateWhenDefaultValueChanges, tabs, ...cProps } =
    getComponentProps(props);
  const {
    getElement,
    callbackMap,
    customStyle,
    mergeState,
    subscribeMethods,
    slotsElements,
  } = props;
  const ref = useRef<{ current: HTMLDivElement }>(null);
  const [activeTab, setActiveTab] = useStateValue(
    defaultActiveTab ?? 0,
    mergeState,
    updateWhenDefaultValueChanges,
    'activeTab'
  );

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
        callbackMap?.onChange?.();
      }}
      onClickTab={key => {
        setActiveTab(Number(key));
        mergeState({ activeTab: Number(key) });
        callbackMap?.onClickTab?.();
      }}
      {...cProps}
      activeTab={String(activeTab)}
      ref={ref}
    >
      {tabs.map((tabItem, idx) =>
        tabItem.hidden ? null : (
          <TabPane
            destroyOnHide={tabItem.destroyOnHide}
            key={String(idx)}
            title={tabItem.title}
          >
            {slotsElements?.content?.({ tabIndex: idx }, undefined, `content_${idx}`)}
          </TabPane>
        )
      )}
    </BaseTabs>
  );
});
