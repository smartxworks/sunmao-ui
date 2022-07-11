import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../src';

const TimeoutTraitPropertiesSpec = Type.Object({
  value: Type.String(),
  timeout: Type.Optional(Type.Number()),
});

export default implementRuntimeTrait({
  version: 'test/v1',
  metadata: {
    name: 'timeout',
    description: 'for test',
  },
  spec: {
    properties: TimeoutTraitPropertiesSpec,
    methods: [],
    state: Type.Object({
      result: Type.String(),
    }),
  },
})(() => {
  return ({ value, mergeState, timeout }) => {
    setTimeout(() => {
      mergeState({ result: value });
    }, timeout || 0);

    return {
      props: null,
    };
  };
});
