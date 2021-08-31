import React, { useEffect, useState } from 'react';
import { createComponent } from '@meta-ui/core';
import {
  Tabs as BaseTabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImplementation } from '../../registry';
import Slot from '../_internal/Slot';

const Tabs: ComponentImplementation<{
  tabNames: Static<typeof TabNamesPropertySchema>;
  initialSelectedTabIndex?: Static<
    typeof InitialSelectedTabIndexPropertySchema
  >;
}> = ({ tabNames, mergeState, initialSelectedTabIndex, slotsMap }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    initialSelectedTabIndex ?? 0
  );

  useEffect(() => {
    mergeState({ selectedTabIndex });
  }, [selectedTabIndex]);

  return (
    <BaseTabs
      defaultIndex={initialSelectedTabIndex}
      onChange={idx => setSelectedTabIndex(idx)}>
      <TabList>
        {tabNames.map((name, idx) => (
          <Tab key={idx}>{name}</Tab>
        ))}
      </TabList>
      <TabPanels>
        {tabNames.map((_, idx) => (
          <TabPanel key={idx}>
            <Slot slotsMap={slotsMap} slot={`tab_content_${idx}`} />
          </TabPanel>
        ))}
      </TabPanels>
    </BaseTabs>
  );
};

const TabNamesPropertySchema = Type.Array(Type.String());
const InitialSelectedTabIndexPropertySchema = Type.Optional(Type.Number());

const StateSchema = Type.Object({
  selectedTabIndex: Type.Number(),
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'tabs',
      description: 'chakra-ui tabs',
    },
    spec: {
      properties: [
        {
          name: 'tabNames',
          ...TabNamesPropertySchema,
        },
        {
          name: 'initialSelectedTabIndex',
          ...InitialSelectedTabIndexPropertySchema,
        },
      ],
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Tabs,
};
