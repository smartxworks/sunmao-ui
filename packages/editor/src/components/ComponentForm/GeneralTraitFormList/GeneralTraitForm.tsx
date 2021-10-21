import { ApplicationComponent, ComponentTrait } from '@meta-ui/core';
import { VStack } from '@chakra-ui/react';
import { renderField } from '../ComponentForm';
import { formWrapperCSS } from '../style';

type Props = {
  component: ApplicationComponent;
  trait: ComponentTrait;
};

export const GeneralTraitForm: React.FC<Props> = props => {
  const { trait, component } = props;

  const fields = Object.keys(trait.properties || []).map(key => {
    const value = trait.properties[key];
    return renderField({
      key,
      value,
      fullKey: key,
      type: trait.type,
      selectedId: component.id,
    });
  });
  return (
    <VStack key={trait.type} css={formWrapperCSS}>
      <strong>{trait.type}</strong>
      {fields}
    </VStack>
  );
};
