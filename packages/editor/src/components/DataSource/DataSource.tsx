import React from 'react';
import {
  VStack,
  Flex,
  Spacer,
  Text,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  IconButton,
  Accordion,
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Api } from './Api';
import { Data } from './Data';
import { EditorServices } from '../../types';
import { DataSourceType, DATA_DATASOURCES } from '../../constants/dataSource';

interface Props {
  active: string;
  services: EditorServices;
}

const DATASOURCE_TYPES = Object.values(DataSourceType);

export const DataSource: React.FC<Props> = props => {
  const { services } = props;
  const { editorStore } = services;
  const NORMAL_DATASOURCES = DATA_DATASOURCES.map(item => ({
    ...item,
    title: item.type,
    datas: editorStore.dataSources[item.type],
  }));
  const onMenuItemClick = (type: DataSourceType) => {
    editorStore.createDataSource(
      type,
      type === DataSourceType.API ? {} : { key: 'value' }
    );
    editorStore.setSelectedComponentId('');
  };
  // const onApiItemClick = (api: ComponentSchema) => {
  //   editorStore.setActiveDataSourceId(api.id);
  //   editorStore.setSelectedComponentId(api.id);
  // };
  // const onDataSourceItemClick = (dataSource: ComponentSchema) => {
  //   editorStore.setActiveDataSourceId(dataSource.id);
  //   editorStore.setToolMenuTab(ToolMenuTabs.INSPECT);
  //   editorStore.setSelectedComponentId(dataSource.id);
  // };
  // const onApiItemRemove = (api: ComponentSchema) => {
  //   editorStore.removeDataSource(api);
  // };
  // const onStateItemRemove = (state: ComponentSchema) => {
  //   editorStore.removeDataSource(state);
  // };
  const MenuItems = () => (
    <>
      {DATASOURCE_TYPES.map(type => (
        <MenuItem key={type} onClick={() => onMenuItemClick(type)}>
          {type}
        </MenuItem>
      ))}
    </>
  );

  return (
    <VStack spacing="2" alignItems="stretch">
      <Flex padding="4" paddingBottom="0">
        <Text fontSize="lg" fontWeight="bold">
          DataSource
        </Text>
        <Spacer />
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            aria-label="add event"
            size="sm"
            variant="ghost"
            colorScheme="blue"
            icon={<AddIcon />}
            rightIcon={<ChevronDownIcon />}
          />
          <MenuList>
            <MenuItems />
          </MenuList>
        </Menu>
      </Flex>
      <Accordion
        reduceMotion
        defaultIndex={[0].concat(NORMAL_DATASOURCES.map((_, i) => i + 1))}
        allowMultiple
      >
        <Api
          services={services}
          apis={editorStore.dataSources[DataSourceType.API] || []}
        />
        {NORMAL_DATASOURCES.map(dataSourceItem => (
          <Data
            key={dataSourceItem.title}
            title={dataSourceItem.title}
            filterPlaceholder={dataSourceItem.filterPlaceholder}
            emptyPlaceholder={dataSourceItem.emptyPlaceholder}
            datas={dataSourceItem.datas}
            services={services}
          />
        ))}
      </Accordion>
    </VStack>
  );
};
