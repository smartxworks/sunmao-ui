import { ApplicationComponent } from '@meta-ui/core';
import { parseTypeBox } from '@meta-ui/runtime';
import { HStack, VStack } from '@chakra-ui/react';
import { TSchema } from '@sinclair/typebox';
import { AddTraitButton } from './AddTraitButton';
import { eventBus } from '../../../eventBus';
import { registry } from '../../../metaUI';
import { AddTraitOperation } from '../../../operations/Operations';
import { ignoreTraitsList } from '../../../constants';
import { GeneralTraitForm } from './GeneralTraitForm';

type Props = {
  component: ApplicationComponent;
};

export const GeneralTraitFormList: React.FC<Props> = props => {
  const { component } = props;

  const onAddTrait = (type: string) => {
    const traitSpec = registry.getTraitByType(type).spec;
    const initProperties = parseTypeBox(traitSpec.properties as TSchema);
    console.log('initProperties', initProperties);
    eventBus.send('operation', new AddTraitOperation(component.id, type, initProperties));
  };

  const traitFields = component.traits
    .filter(t => {
      return !ignoreTraitsList.includes(t.type);
    })
    .map((t, i) => {
      return <GeneralTraitForm key={i} component={component} trait={t} />;
    });

  return (
    <VStack width="full" alignItems="start">
      <HStack width="full" justify="space-between">
        <strong>Traits</strong>
        <AddTraitButton onAddTrait={onAddTrait} />
      </HStack>
      {traitFields}
    </VStack>
  );
};
