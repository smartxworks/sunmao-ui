import { useEffect } from 'react';
import { Kbd as BaseKbd } from '@chakra-ui/react';
import { Static, Type } from '@sinclair/typebox';
import { createComponent } from '@meta-ui/core';
import { ComponentImplementation } from '../../services/registry';
import Text, { TextPropertySchema } from '../_internal/Text';

const Kbd: ComponentImplementation<Static<typeof PropsSchema>> = ({
  text,
  mergeState,
}) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [text.raw]);

  return (
    <BaseKbd>
      <Text value={text} />
    </BaseKbd>
  );
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
});

export default {
  ...createComponent({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'kbd',
      description: 'chakra-ui keyboard',
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Kbd,
};
