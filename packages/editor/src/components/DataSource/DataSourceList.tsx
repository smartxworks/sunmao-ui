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
import { DataSourceNode } from './DataSourceNode';
import { EditorServices } from '../../types';
import { DataSourceType } from '../../constants/dataSource';
import { groupBy } from 'lodash';

interface Props {
  active: string;
  services: EditorServices;
}

const DATASOURCE_TYPES = Object.values(DataSourceType);

export const DataSourceList: React.FC<Props> = props => {
  const { services } = props;
  const { editorStore } = services;
  const group = groupBy(editorStore.dataSources, c => c.traits[0]?.type);
  // const NORMAL_DATASOURCES = DATA_DATASOURCES.map(item => ({
  //   ...item,
  //   title: item.type,
  //   datas: editorStore.dataSources[item.type],
  // }));
  const NORMAL_DATASOURCES = Object.keys(group).map(type => {
    return {
      title: type,
      datas: group[type],
    };
  });
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
        {NORMAL_DATASOURCES.map(dataSourceItem => (
          <DataSourceNode
            key={dataSourceItem.title}
            title={dataSourceItem.title}
            filterPlaceholder={'filter'}
            emptyPlaceholder={'Empty'}
            datas={dataSourceItem.datas}
            services={services}
          />
        ))}
      </Accordion>
    </VStack>
  );
};
