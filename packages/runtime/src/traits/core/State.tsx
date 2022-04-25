import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, STATE_TRAIT_NAME } from '@sunmao-ui/shared';

type KeyValue = { key: string; value: unknown };

export const StateTraitPropertiesSpec = Type.Object({
  key: Type.String(),
  initialValue: Type.Any(),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: STATE_TRAIT_NAME,
    description: 'add state to component',
  },
  spec: {
    properties: StateTraitPropertiesSpec,
    state: Type.Any(),
    methods: [
      {
        name: 'setValue',
        parameters: Type.Object({
          key: Type.String(),
          value: Type.Any(),
        }),
      },
      {
        name: 'reset',
      },
    ],
  },
})(() => {
  const HasInitializedMap = new Map<string, boolean>();

  return ({ key, initialValue, componentId, mergeState, subscribeMethods }) => {
    const hashId = `#${componentId}@${key}`;
    const hasInitialized = HasInitializedMap.get(hashId);

    if (!hasInitialized) {
      mergeState({ [key]: initialValue });

      const methods = {
        setValue({ key, value }: KeyValue) {
          mergeState({ [key]: value });
        },
        resetValue({ key }: KeyValue) {
          mergeState({ [key]: initialValue });
        },
      };
      subscribeMethods(methods);
      HasInitializedMap.set(hashId, true);
    }

    return {
      props: null,
    };
  };
});
