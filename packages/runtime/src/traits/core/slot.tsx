import { createTrait } from '@sunmao-ui/core';
import { Type } from '@sinclair/typebox';

export const ContainerPropertySchema = Type.Object({
  id: Type.String(),
  slot: Type.String(),
});

const PropsSchema = Type.Object({
  container: ContainerPropertySchema,
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'slot',
      description: 'nested components by slots',
    },
    spec: {
      properties: PropsSchema,
    },
  }),
  impl: () => ({
    props: null,
  }),
};
