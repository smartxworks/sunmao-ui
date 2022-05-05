import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';

const TransformTraitFactory: TraitImplFactory<
  Static<typeof TransformerTraitPropertiesSpec>
> = () => {
  return ({ value, mergeState }) => {
    mergeState({ value });

    return {
      props: {},
    };
  };
};

const TransformerTraitPropertiesSpec = Type.Object({
  value: Type.Any({
    title: 'Value',
  }),
});
const TransformerTraitStateSpec = Type.Object({
  value: Type.Any(),
});

export default {
  ...createTrait({
    version: 'core/v1',
    metadata: {
      name: 'transformer',
      description: 'transform the value',
    },
    spec: {
      properties: TransformerTraitPropertiesSpec,
      methods: [],
      state: TransformerTraitStateSpec,
    },
  }),
  factory: TransformTraitFactory,
};
