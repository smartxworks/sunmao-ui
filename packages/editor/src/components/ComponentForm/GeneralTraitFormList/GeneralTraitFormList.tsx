import { TSchema } from '@sinclair/typebox';
import { ComponentSchema } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { HStack, VStack } from '@chakra-ui/react';

import { AddTraitButton } from './AddTraitButton';
import { GeneralTraitForm } from './GeneralTraitForm';
import { ignoreTraitsList } from '../../../constants';
import { genOperation } from '../../../operations';
import { EditorServices } from '../../../types';

type Props = {
  component: ComponentSchema;
  services: EditorServices;
};

export const GeneralTraitFormList: React.FC<Props> = props => {
  const { component, services } = props;
  const { eventBus, registry } = services;

  const onAddTrait = (type: string) => {
    const traitSpec = registry.getTraitByType(type).spec;
    const initProperties = parseTypeBox(traitSpec.properties as TSchema);
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
    if (ignoreTraitsList.includes(trait.type)) {
      return null;
    }
    const onRemoveTrait = () => {
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
    <VStack width="full" alignItems="start">
      <HStack width="full" justify="space-between">
        <strong>Traits</strong>
        <AddTraitButton onAddTrait={onAddTrait} registry={registry} />
      </HStack>
      {traitFields}
    </VStack>
  );
};
