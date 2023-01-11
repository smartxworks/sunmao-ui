import React from 'react';
import { ComponentSchema } from '@sunmao-ui/core';
import { generateDefaultValueFromSpec } from '@sunmao-ui/shared';
import { VStack } from '@chakra-ui/react';

import { AddTraitButton } from './AddTraitButton';
import { GeneralTraitForm } from './GeneralTraitForm';
import { hasSpecialFormTraitList, unremovableTraits } from '../../../constants';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';
import { JSONSchema7Object } from 'json-schema';

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

export const GeneralTraitFormList: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const onAddTrait = (type: string) => {
    const traitDefine = registry.getTraitByType(type);
    const traitSpec = traitDefine.spec;
    const initProperties =
      traitDefine.metadata.exampleProperties ||
      (generateDefaultValueFromSpec(traitSpec.properties) as JSONSchema7Object);
    eventBus.send(
      'operation',
      genOperation(registry, 'createTrait', {
        componentId: component.id,
        traitType: type,
        properties: initProperties,
      })
    );
  };

  const traitFields = component.traits.map((trait, index) => {
    if (hasSpecialFormTraitList.includes(trait.type)) {
      return null;
    }
    const onRemoveTrait = unremovableTraits.includes(trait.type)
      ? null
      : () => {
          eventBus.send(
            'operation',
            genOperation(registry, 'removeTrait', {
              componentId: component.id,
              index,
            })
          );
        };

    return (
      <GeneralTraitForm
        key={index}
        component={component}
        trait={trait}
        traitIndex={index}
        onRemove={onRemoveTrait}
        services={services}
      />
    );
  });

  return (
    <VStack width="full" alignItems="start" spacing="2">
      {traitFields}
      <AddTraitButton onAddTrait={onAddTrait} registry={registry} component={component} />
    </VStack>
  );
};
