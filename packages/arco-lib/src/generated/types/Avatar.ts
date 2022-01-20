
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const AvatarPropsSchema = {
  'shape': Type.Optional(StringUnion(['circle', 'square'])),
  'autoFixFontSize': Type.Optional(Type.Boolean()),
  'triggerType': Type.Optional(StringUnion(['button', 'mask']))
};
