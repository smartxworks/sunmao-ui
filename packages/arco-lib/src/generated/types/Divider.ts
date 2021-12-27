
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const DividerPropsSchema = {
  'type': Type.Optional(StringUnion(['vertical', 'horizontal'])),
  'orientation': Type.Optional(StringUnion(['center', 'left', 'right']))
};
