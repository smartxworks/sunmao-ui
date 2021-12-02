import { ApplicationComponent } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { HStack, VStack } from '@chakra-ui/react';
import { TSchema } from '@sinclair/typebox';
import { AddTraitButton } from './AddTraitButton';
import { GeneralTraitForm } from './GeneralTraitForm';
import { eventBus } from '../../../eventBus';
import { ignoreTraitsList } from '../../../constants';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { genOperation } from 'operations';

type Props = {
  registry: Registry;
  component: ApplicationComponent;
};

export const GeneralTraitFormList: React.FC<Props> = props => {
  const { component, registry } = props;

  const onAddTrait = (type: string) => {
    const traitSpec = registry.getTraitByType(type).spec;
    const initProperties = parseTypeBox(traitSpec.properties as TSchema);
    eventBus.send(
      'operation',
      genOperation('createTrait', {
        componentId: component.id,
        traitType: type,
        properties: initProperties,
      })
    );
  };

  const traitFields = component.traits
    .filter(trait => {
      return !ignoreTraitsList.includes(trait.type);
    })
    .map((trait, index) => {
      const onRemoveTrait = () => {
        eventBus.send(
          'operation',
          genOperation('removeTrait', {
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
          onRemove={onRemoveTrait}
          registry={registry}
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
