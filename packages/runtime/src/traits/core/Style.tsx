import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, STYLE_TRAIT_NAME } from '@sunmao-ui/shared';

export const StyleTraitPropertiesSpec = Type.Object({
  styles: Type.Array(
    Type.Object({
      styleSlot: Type.String(),
      style: Type.String(),
    })
  ),
});

export default implementRuntimeTrait({
  version: CORE_VERSION,
  metadata: {
    name: STYLE_TRAIT_NAME,
    description: 'add style to component',
  },
  spec: {
    properties: StyleTraitPropertiesSpec,
    methods: [],
    state: {},
  },
})(() => {
  return ({ styles }) => {
    const customStyle: Record<string, string> = {};
    styles.forEach(style => {
      customStyle[style.styleSlot] = style.style;
    });
    return {
      props: {
        customStyle,
      },
    };
  };
});
