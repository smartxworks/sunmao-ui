import { ApplicationComponent } from '@sunmao-ui/core';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { HStack, VStack } from '@chakra-ui/react';
import { TSchema } from '@sinclair/typebox';
import { AddTraitButton } from './AddTraitButton';
import { GeneralTraitForm } from './GeneralTraitForm';
import { eventBus } from '../../../eventBus';
import { ignoreTraitsList } from '../../../constants';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { NewTraitOperation } from '../../../operations/leaf/trait/newOperation';
import { FreeTraitOperation } from '../../../operations/leaf/trait/freeOperation';

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
      new NewTraitOperation({
        componentId: component.id,
        traitType: type,
        properties: initProperties,
      })
    );
  };

  const traitFields = component.traits
    .filter(t => {
      return !ignoreTraitsList.includes(t.type);
    })
    .map((t, i) => {
      const onRemoveTrait = () => {
        eventBus.send(
          'operation',
          new FreeTraitOperation({ componentId: component.id, index: i })
        );
      };
      return (
        <GeneralTraitForm
          key={i}
          component={component}
          trait={t}
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
