import { createTrait } from '@sunmao-ui/core';
import { Static, Type } from '@sinclair/typebox';
import { TraitImplFactory } from '../../types';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

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
    version: CORE_VERSION,
    metadata: {
      name: CoreTraitName.Transformer,
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
