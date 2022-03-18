import React from 'react';
import { ComponentSchema, TraitSchema } from '@sunmao-ui/core';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { CloseIcon } from '@chakra-ui/icons';
import { TSchema } from '@sinclair/typebox';
import { formWrapperCSS } from '../style';
import { EditorServices } from '../../../types';
import { SchemaField } from '@sunmao-ui/editor-sdk';
import { genOperation } from '../../../operations';

type Props = {
  component: ComponentSchema;
  trait: TraitSchema;
  traitIndex: number;
  onRemove: () => void;
  services: EditorServices;
};

export const GeneralTraitForm: React.FC<Props> = props => {
  const { trait, traitIndex, component, onRemove, services } = props;
  const { registry, eventBus } = services;

  const tImpl = registry.getTraitByType(trait.type);
  const properties = Object.assign(
    parseTypeBox(tImpl.spec.properties as TSchema),
    trait.properties
  );
  const fields = Object.keys(properties || []).map((key: string) => {
    const value = trait.properties[key];
    const propertySchema = (tImpl.spec.properties as TSchema).properties?.[key];
    const onChange = (newValue: any)=> {
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
      <SchemaField
        key={key}
        level={1}
        path={[key]}
        schema={{
          ...propertySchema,
          title: propertySchema.title || key
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
        <IconButton
          aria-label="remove trait"
          variant="ghost"
          colorScheme="red"
          size="xs"
          icon={<CloseIcon />}
          onClick={onRemove}
        />
      </HStack>
      {fields}
    </VStack>
  );
};
