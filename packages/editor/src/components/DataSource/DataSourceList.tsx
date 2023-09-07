import React, { useCallback, useMemo, useState } from 'react';
import {
  VStack,
  Spacer,
  Text,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Accordion,
  MenuGroup,
  HStack,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { DataSourceGroup } from './DataSourceGroup';
import { EditorServices } from '../../types';
import { groupBy } from 'lodash';
import { genOperation } from '../../operations';
import { generateDefaultValueFromSpec } from '@sunmao-ui/shared';
import { JSONSchema7 } from 'json-schema';
import { ToolMenuTabs } from '../../constants/enum';
import { ComponentSearch } from '../StructureTree/ComponentSearch';
import { ComponentSchema } from '@sunmao-ui/core';

interface Props {
  services: EditorServices;
}

export const DataSourceList: React.FC<Props> = props => {
  const { services } = props;
  const { editorStore, eventBus, registry } = services;
  const { dataSources, setSelectedComponentId, setToolMenuTab } = editorStore;
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const tagMap = services.editorStore.app.metadata.annotations?.componentsTagMap;
  // filter datasources by tag
  const filteredDataSources = useMemo(() => {
    if (!tagMap || checkedTags.length === 0) {
      return dataSources;
    }

    const dataSourceIds = checkedTags.reduce<string[]>((result, curr) => {
      return result.concat(tagMap[curr]);
    }, []);

    return dataSources.filter(d => dataSourceIds.includes(d.id)) as ComponentSchema[];
  }, [checkedTags, dataSources, tagMap]);

  const tDataSources = filteredDataSources.filter(ds => ds.type === 'core/v1/dummy');
  const cDataSources = filteredDataSources.filter(ds => ds.type !== 'core/v1/dummy');
  const cdsMap = groupBy(cDataSources, c => c.type);
  const tdsMap = groupBy(tDataSources, c => c.traits[0]?.type || '');
  const cdsGroups = Object.keys(cdsMap).map(type => {
    return {
      title: type,
      dataSources: cdsMap[type],
      type: 'component',
    };
  });
  const tdsGroups = Object.keys(tdsMap).map(type => {
    return {
      title: type,
      dataSources: tdsMap[type] || [],
      type: 'trait',
    };
  });

  const dsGroups = cdsGroups.concat(tdsGroups);

  // cdsTypes: component data source types
  // tdsTypes: trait data source types
  const { cdsTypes, tdsTypes } = useMemo(() => {
    const cdsTypes = registry
      .getAllComponents()
      .filter(c => c.metadata.isDataSource && c.metadata.name !== 'dummy')
      .map(c => `${c.version}/${c.metadata.name}`);
    const tdsTypes = registry
      .getAllTraits()
      .filter(t => t.metadata.isDataSource)
      .map(t => `${t.version}/${t.metadata.name}`);
    return { cdsTypes, tdsTypes };
  }, [registry]);

  const getNewId = useCallback(
    (name: string): string => {
      let count = dataSources.length;
      let id = `${name}${count}`;
      const ids = dataSources.map(({ id }) => id);

      while (ids.includes(id)) {
        id = `${name}${++count}`;
      }

      return `${name}${count}`;
    },
    [dataSources]
  );
  const onCreateDSFromComponent = useCallback(
    (type: string) => {
      const name = type.split('/')[2];
      const id = getNewId(name);

      eventBus.send(
        'operation',
        genOperation(registry, 'createComponent', {
          componentType: type,
          componentId: id,
        })
      );

      setSelectedComponentId(id);
      setToolMenuTab(ToolMenuTabs.INSPECT);
    },
    [eventBus, getNewId, registry, setSelectedComponentId, setToolMenuTab]
  );
  const onCreateDSFromTrait = useCallback(
    (type: string) => {
      const traitDefine = registry.getTraitByType(type);
      const propertiesSpec = traitDefine.spec.properties;
      const defaultProperties =
        traitDefine.metadata.exampleProperties ||
        generateDefaultValueFromSpec(propertiesSpec, {
          genArrayItemDefaults: false,
        });
      const name = type.split('/')[2];
      const id = getNewId(name);

      eventBus.send(
        'operation',
        genOperation(registry, 'createDataSource', {
          id,
          type,
          defaultProperties: defaultProperties as JSONSchema7,
        })
      );

      setSelectedComponentId(id);
      setToolMenuTab(ToolMenuTabs.INSPECT);
    },
    [eventBus, getNewId, registry, setSelectedComponentId, setToolMenuTab]
  );

  return (
    <VStack spacing="2" alignItems="stretch">
      <HStack padding="4" paddingBottom="0">
        <Text fontSize="lg" fontWeight="bold">
          DataSources
        </Text>
        <Spacer />
        <Menu isLazy>
          <MenuButton
            as={Button}
            size="sm"
            variant="ghost"
            rightIcon={<ChevronDownIcon />}
            colorScheme="blue"
          >
            Add
          </MenuButton>
          <MenuList>
            {cdsTypes.length ? (
              <MenuGroup title="From Component">
                {cdsTypes.map(type => (
                  <MenuItem key={type} onClick={() => onCreateDSFromComponent(type)}>
                    {type}
                  </MenuItem>
                ))}
              </MenuGroup>
            ) : undefined}
            <MenuGroup title="From Trait">
              {tdsTypes.map(type => (
                <MenuItem key={type} onClick={() => onCreateDSFromTrait(type)}>
                  {type}
                </MenuItem>
              ))}
            </MenuGroup>
          </MenuList>
        </Menu>
      </HStack>
      <ComponentSearch
        components={dataSources}
        onChange={id => setSelectedComponentId(id)}
        services={props.services}
        tags={tagMap ? Object.keys(tagMap) : []}
        checkedTags={checkedTags}
        onTagsChange={v => setCheckedTags(v)}
      />
      <Accordion
        reduceMotion
        defaultIndex={[0].concat(dsGroups.map((_, i) => i + 1))}
        allowMultiple
      >
        {dsGroups.map(group => (
          <DataSourceGroup
            key={group.title}
            title={group.title}
            type={group.type}
            dataSources={group.dataSources}
            services={services}
          />
        ))}
      </Accordion>
    </VStack>
  );
};
