import { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import {
  Tabs as BaseTabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
} from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';

const StateSchema = Type.Object({
  selectedTabIndex: Type.Number(),
});

const PropsSchema = Type.Object({
  tabNames: Type.Array(Type.String()),
  initialSelectedTabIndex: Type.Optional(Type.Number()),
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'tabs',
    displayName: 'Tabs',
    description: 'chakra-ui tabs',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      tabNames: [],
      initialSelectedTabIndex: 0,
    },
    exampleSize: [6, 6],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    // tab slot is dynamic
    slots: ['content'],
    styleSlots: ['tabItem', 'tabContent'],
    events: [],
  },
})(props => {
  const { tabNames, mergeState, initialSelectedTabIndex, customStyle, slotsElements } =
    props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex ?? 0);

  useEffect(() => {
    mergeState({ selectedTabIndex });
  }, [mergeState, selectedTabIndex]);

  const placeholder = (
    <Text color="gray">Slot content is empty.Please drag component to this slot.</Text>
  );
  return (
    <BaseTabs
      defaultIndex={initialSelectedTabIndex}
      onChange={idx => setSelectedTabIndex(idx)}
    >
      <TabList>
        {tabNames.map((name, idx) => (
          <Tab
            key={idx}
            className={css`
              ${customStyle?.tabItem}
            `}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabNames.map((_, idx) => {
          const ele = slotsElements.content ? ([] as React.ReactElement[]).concat(slotsElements.content)[idx] : placeholder;
          return (
            <TabPanel
              key={idx}
              className={css`
                ${customStyle?.tabContent}
              `}
            >
              {ele}
            </TabPanel>
          );
        })}
      </TabPanels>
    </BaseTabs>
  );
});
