
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

const RadioItemSchema = Type.Object({
  'value': Type.String(),
  'label': Type.String(),
  'disabled': Type.Boolean()
});

export const RadioPropsSchema = {
  options: Type.Array(RadioItemSchema),
  defaultCheckedValue: Type.Optional(Type.String()),
  type: StringUnion(['radio', 'button']),
  direction: StringUnion(['horizontal', 'vertical']),
  size: StringUnion(['small', 'default', 'large', 'mini']),
};
