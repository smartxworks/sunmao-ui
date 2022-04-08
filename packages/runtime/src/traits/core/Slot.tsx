import { createTrait } from '@sunmao-ui/core';
import { Type } from '@sinclair/typebox';

export const ContainerPropertySpec = Type.Object({
  id: Type.String(),
  slot: Type.String(),
});

const PropsSpec = Type.Object({
  container: ContainerPropertySpec,
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'slot',
      description: 'nested components by slots',
    },
    spec: {
      properties: PropsSpec,
      state: {},
      methods: [],
    },
  }),
  factory: () => () => ({
    props: null,
  }),
};
