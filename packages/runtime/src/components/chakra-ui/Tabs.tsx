import { useEffect, useState } from 'react';
import { createComponent } from '@meta-ui/core';
import { Tabs as BaseTabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImplementation } from '../../modules/registry';
import Slot from '../_internal/Slot';

const Tabs: ComponentImplementation<Static<typeof PropsSchema>> = ({
  tabNames,
  mergeState,
  initialSelectedTabIndex,
  slotsMap,
  style,
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
          <Tab key={idx} css={style?.tabItem}>
            {name}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabNames.map((_, idx) => (
          <TabPanel key={idx} css={style?.tabContent}>
            <Slot slotsMap={slotsMap} slot={`tab_content_${idx}`} />
          </TabPanel>
        ))}
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
      description: 'chakra-ui tabs',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Tabs,
};
