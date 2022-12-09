import React from 'react';
import { ComponentSchema, TraitSchema } from '@sunmao-ui/core';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { SpecWidget } from '@sunmao-ui/editor-sdk';
import { generateDefaultValueFromSpec } from '@sunmao-ui/shared';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';
import { genOperation } from '../../../operations';

type Props = {
  component: ComponentSchema;
  trait: TraitSchema;
  traitIndex: number;
  onRemove?: (() => void) | null;
  services: EditorServices;
};

export const GeneralTraitForm: React.FC<Props> = props => {
  const { trait, traitIndex, component, onRemove, services } = props;
  const { registry, eventBus } = services;

  const tImpl = registry.getTraitByType(trait.type);
  const properties = Object.assign(
    generateDefaultValueFromSpec(tImpl.spec.properties)!,
    trait.properties
  );
  const onChange = (newValue: any) => {
    const operation = genOperation(registry, 'modifyTraitProperty', {
      componentId: component.id,
      traitIndex: traitIndex,
      properties: newValue,
    });

    eventBus.send('operation', operation);
  };

  return (
    <VStack key={trait.type} className={formWrapperCSS}>
      <HStack width="full" justifyContent="space-between">
        <strong>{trait.type}</strong>
        {!tImpl.metadata.isDataSource && onRemove ? (
          <IconButton
            aria-label="remove trait"
            variant="ghost"
            colorScheme="red"
            size="xs"
            icon={<CloseIcon />}
            onClick={onRemove}
          />
        ) : null}
      </HStack>
      <SpecWidget
        level={0}
        path={[]}
        // don't show category in trait form
        hideCategory
        spec={tImpl.spec.properties}
        value={properties}
        services={services}
        component={component}
        onChange={onChange}
      />
    </VStack>
  );
};
