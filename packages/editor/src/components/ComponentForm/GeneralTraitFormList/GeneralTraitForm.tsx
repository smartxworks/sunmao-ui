import React from 'react';
import { ComponentSchema, TraitSchema } from '@sunmao-ui/core';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { parseTypeBox } from '@sunmao-ui/shared';
import { CloseIcon } from '@chakra-ui/icons';
import { TSchema } from '@sinclair/typebox';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';
import { SpecWidget } from '@sunmao-ui/editor-sdk';
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
    parseTypeBox(tImpl.spec.properties)!,
    trait.properties
  );
  const fields = Object.keys(properties || []).map((key: string) => {
    const value = trait.properties[key];
    const propertySpec = (tImpl.spec.properties as TSchema).properties?.[key];
    const onChange = (newValue: any) => {
      const operation = genOperation(registry, 'modifyTraitProperty', {
        componentId: component.id,
        traitIndex: traitIndex,
        properties: {
          [key]: newValue,
        },
      });

      eventBus.send('operation', operation);
    };

    return (
      <SpecWidget
        key={key}
        level={1}
        path={[key]}
        spec={{
          ...propertySpec,
          title: propertySpec.title || key,
        }}
        value={value}
        services={services}
        component={component}
        onChange={onChange}
      />
    );
  });

  return (
    <VStack key={trait.type} className={formWrapperCSS}>
      <HStack width="full" justifyContent="space-between">
        <strong>{trait.type}</strong>
        {onRemove ? (
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
      {fields}
    </VStack>
  );
};
