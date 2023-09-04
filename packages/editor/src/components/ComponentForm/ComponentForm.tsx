import React from 'react';
import { observer } from 'mobx-react-lite';
import { Accordion, Input, Text, VStack } from '@chakra-ui/react';
import { ComponentFormElementId, SpecWidget } from '@sunmao-ui/editor-sdk';
import { parseType } from '@sunmao-ui/core';
import { css } from '@emotion/css';

import { EventTraitForm } from './EventTraitForm';
import { GeneralTraitFormList } from './GeneralTraitFormList';
import { genOperation } from '../../operations';
import ErrorBoundary from '../ErrorBoundary';
import { StyleTraitForm } from './StyleTraitForm';
import { EditorServices } from '../../types';
import { FormSection } from './FormSection';
import { TagForm } from './TagForm';

// avoid the expression tip would be covered
const ComponentFormStyle = css`
  .chakra-collapse {
    overflow: initial !important;
  }
`;

type Props = {
  services: EditorServices;
};

export const ComponentForm: React.FC<Props> = observer(props => {
  const { services } = props;
  const { editorStore, registry, eventBus } = services;
  const { selectedComponent, selectedComponentId, selectedComponentIsDataSource } =
    editorStore;
  if (!selectedComponentId) {
    return (
      <Text p={2} fontSize="md">
        No components selected. Click on a component to select it.
      </Text>
    );
  }

  if (!selectedComponent) {
    return (
      <Text p={2} fontSize="md">
        Cannot find component with id: {selectedComponentId}.
      </Text>
    );
  }
  const { version, name } = parseType(selectedComponent.type);
  const cImpl = registry.getComponent(version, name);
  const properties = selectedComponent.properties;

  const changeComponentId = (selectedComponentId: string, value: string) => {
    eventBus.send(
      'operation',
      genOperation(registry, 'modifyComponentId', {
        componentId: selectedComponentId,
        newId: value,
      })
    );
    editorStore.setSelectedComponentId(value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    // prevent form keyboard events to accidentally trigger operation shortcut
    e.stopPropagation();
  };

  const sections = [
    {
      title: 'Component Type',
      node: <Text paddingLeft="3">{selectedComponent.type}</Text>,
    },
    {
      title: 'Component ID',
      node: (
        <Input
          key={selectedComponent.id}
          background="white"
          border="1px solid"
          borderColor="gray.400"
          defaultValue={selectedComponent.id}
          onBlur={e => changeComponentId(selectedComponent?.id, e.target.value)}
        />
      ),
    },
    {
      title: 'Properties',
      node: (
        <VStack width="full" background="white">
          <SpecWidget
            key={selectedComponent.id}
            component={selectedComponent}
            spec={cImpl.spec.properties}
            value={properties}
            path={[]}
            level={0}
            onChange={newFormData => {
              eventBus.send(
                'operation',
                genOperation(registry, 'modifyComponentProperties', {
                  componentId: selectedComponentId,
                  properties: newFormData,
                })
              );
            }}
            services={services}
          />
        </VStack>
      ),
      hide: Object.keys(cImpl.spec.properties.properties).length === 0,
    },
    {
      title: 'Events',
      node: <EventTraitForm component={selectedComponent} services={services} />,
    },
    {
      title: 'Styles',
      node: (
        <StyleTraitForm
          key={selectedComponentId}
          component={selectedComponent}
          services={services}
        />
      ),
      hide: selectedComponentIsDataSource,
    },
    {
      title: 'Traits',
      node: <GeneralTraitFormList component={selectedComponent} services={services} />,
    },
    {
      title: 'Tags',
      node: <TagForm services={services} />,
    },
  ];

  return (
    <ErrorBoundary>
      <Accordion
        id={ComponentFormElementId}
        reduceMotion
        className={ComponentFormStyle}
        defaultIndex={sections.map((_, i) => i)}
        background="gray.50"
        paddingBottom="200px"
        allowMultiple
        onKeyDown={onKeyDown}
      >
        {sections.map((section, i) => {
          if (section.hide) return undefined;
          return (
            <FormSection
              style={{ position: 'relative', zIndex: sections.length - i }}
              title={section.title}
              key={`${section.title}-${selectedComponentId}`}
            >
              {section.node}
            </FormSection>
          );
        })}
      </Accordion>
    </ErrorBoundary>
  );
});
