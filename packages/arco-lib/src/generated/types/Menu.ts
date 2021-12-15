
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const MenuPropsSchema = {
  'prefixCls': Type.Optional(Type.String()),
  'isMenu': Type.Optional(Type.Boolean()),
  'inDropdown': Type.Optional(Type.Boolean()),
  'theme': Type.Optional(StringUnion(['dark', 'light'])),
  'mode': Type.Optional(StringUnion(['vertical', 'horizontal', 'pop', 'popButton'])),
  'autoOpen': Type.Optional(Type.Boolean()),
  'collapse': Type.Optional(Type.Boolean()),
  'accordion': Type.Optional(Type.Boolean()),
  'selectable': Type.Optional(Type.Boolean()),
  'ellipsis': Type.Optional(Type.Boolean()),
  'autoScrollIntoView': Type.Optional(Type.Boolean()),
  'hasCollapseButton': Type.Optional(Type.Boolean())
};
