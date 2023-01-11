import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

type KeyValue = { key: string; value: unknown };

export const StateTraitPropertiesSpec = Type.Object({
  key: Type.String({
    title: 'Key',
    default: 'value',
  }),
  initialValue: Type.Any({
    title: 'Initial Value',
  }),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: CoreTraitName.State,
    description: 'add state to component',
    isDataSource: true,
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
      props: {
        componentDidMount: [
          () => {
            mergeState({ [key]: initialValue });
          },
        ],
        componentDidUnmount: [
          () => {
            HasInitializedMap.delete(hashId);
          },
        ],
      },
    };
  };
});
