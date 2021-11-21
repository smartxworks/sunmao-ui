import { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { createComponent } from '@sunmao-ui/core';
import { Tabs as BaseTabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';
import { getSlots } from '../_internal/Slot';

const Tabs: ComponentImplementation<Static<typeof PropsSchema>> = ({
  tabNames,
  mergeState,
  initialSelectedTabIndex,
  slotsMap,
  customStyle,
}) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialSelectedTabIndex ?? 0);

  useEffect(() => {
    mergeState({ selectedTabIndex });
  }, [selectedTabIndex]);
  return (
    <BaseTabs
      defaultIndex={initialSelectedTabIndex}
      onChange={idx => setSelectedTabIndex(idx)}
    >
      <TabList>
        {tabNames.map((name, idx) => (
          <Tab
            key={idx}
            css={css`
              ${customStyle?.tabItem}
            `}
          >
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {getSlots(slotsMap, 'content').map((content, idx) => {
          return (
            <TabPanel
              key={idx}
              css={css`
                ${customStyle?.tabContent}
              `}
            >
              {content}
            </TabPanel>
          );
        })}
      </TabPanels>
    </BaseTabs>
  );
};

const StateSchema = Type.Object({
  selectedTabIndex: Type.Number(),
});

const PropsSchema = Type.Object({
  tabNames: Type.Array(Type.String()),
  initialSelectedTabIndex: Type.Optional(Type.Number()),
});

export default {
  ...createComponent({
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
      methods: [],
      // tab slot is dynamic
      slots: ['content'],
      styleSlots: ['tabItem', 'tabContent'],
      events: [],
    },
  }),
  impl: Tabs,
};
