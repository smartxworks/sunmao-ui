import { Type } from '@sinclair/typebox';
import { implementRuntimeTrait } from '../../utils/buildKit';
import { CORE_VERSION, CoreTraitName } from '@sunmao-ui/shared';

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
    name: CoreTraitName.Style,
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
    styles.forEach(({ style, styleSlot }) => {
      if (!customStyle[styleSlot]) {
        customStyle[styleSlot] = '';
      }
      // add a ';' between css texts, in case user forgets to add ';' in the end
      customStyle[styleSlot] = `&&& {${customStyle[styleSlot]};${style}}`;
    });
    return {
      props: {
        customStyle,
      },
    };
  };
});
