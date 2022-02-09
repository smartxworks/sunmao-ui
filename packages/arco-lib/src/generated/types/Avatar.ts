
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const AvatarPropsSchema = {
  'shape': StringUnion(['circle', 'square']),
  'autoFixFontSize': Type.Boolean(),
  'triggerType': StringUnion(['button', 'mask'])
};
