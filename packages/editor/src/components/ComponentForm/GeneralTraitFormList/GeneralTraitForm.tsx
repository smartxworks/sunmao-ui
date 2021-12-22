import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { HStack, IconButton, VStack } from '@chakra-ui/react';
import { parseTypeBox } from '@sunmao-ui/runtime';
import { CloseIcon } from '@chakra-ui/icons';
import { TSchema } from '@sinclair/typebox';
import { renderField } from '../ComponentForm';
import { formWrapperCSS } from '../style';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';

type Props = {
  registry: Registry;
  component: ApplicationComponent;
  trait: ComponentTrait;
  traitIndex: number;
  onRemove: () => void;
};

export const GeneralTraitForm: React.FC<Props> = props => {
  const { trait, traitIndex, component, onRemove, registry } = props;

  const tImpl = registry.getTraitByType(trait.type);
  const properties = Object.assign(
    parseTypeBox(tImpl.spec.properties as TSchema),
    trait.properties
  );
  console.log('properties', properties)
  const fields = Object.keys(properties || []).map((key: string) => {
    const value = trait.properties[key];
    return renderField({
      index: traitIndex,
      key,
      value,
      fullKey: key,
      type: trait.type,
      selectedComponentId: component.id,
    });
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
