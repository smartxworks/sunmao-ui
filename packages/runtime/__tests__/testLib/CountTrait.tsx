import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../src';

const CountTraitPropertiesSpec = Type.Object({
  param1: Type.Any(),
  param2: Type.Any(),
});

export default implementRuntimeTrait({
  version: 'test/v1',
  metadata: {
    name: 'count',
    description: 'for test',
  },
  spec: {
    properties: CountTraitPropertiesSpec,
    methods: [],
    state: Type.Object({
      count: Type.String(),
    }),
  },
})(() => {
  return ({ param1, param2, componentId, mergeState, services }) => {
    const state = services.stateManager.store[componentId];

    // read the states. don't remove this line
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const string = param1 + param2;

    return {
      props: {
        traitPropertiesDidUpdated: [
          () => {
            mergeState({
              count: (state.count || 0) + 1,
            });
          },
        ],
      },
    };
  };
});
