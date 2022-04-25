import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, HIDDEN_TRAIT_NAME } from '@sunmao-ui/shared';

export const HiddenTraitPropertiesSpec = Type.Object({
  hidden: Type.Boolean(),
  visually: Type.Optional(Type.Boolean()),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: HIDDEN_TRAIT_NAME,
    description: 'render component with condition',
  },
  spec: {
    properties: HiddenTraitPropertiesSpec,
    state: {},
    methods: [],
  },
})(() => {
  return ({ hidden, visually }) => {
    if (visually) {
      return {
        props: {
          customStyle: {
            content: hidden ? 'display: none' : '',
          },
        },
      };
    }

    return {
      props: {},
      unmount: hidden,
    };
  };
});
