
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const MenuPropsSchema = {
  'prefixCls': Type.String(),
  'isMenu': Type.Boolean(),
  'inDropdown': Type.Boolean(),
  'theme': StringUnion(['dark', 'light']),
  'mode': StringUnion(['vertical', 'horizontal', 'pop', 'popButton']),
  'autoOpen': Type.Boolean(),
  'collapse': Type.Boolean(),
  'accordion': Type.Boolean(),
  'selectable': Type.Boolean(),
  'ellipsis': Type.Boolean(),
  'autoScrollIntoView': Type.Boolean(),
  'hasCollapseButton': Type.Boolean()
};
