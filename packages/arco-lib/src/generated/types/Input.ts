
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const InputPropsSchema = {
  'allowClear': Type.Optional(Type.Boolean()),
  'disabled': Type.Optional(Type.Boolean()),
  'readOnly': Type.Optional(Type.Boolean()),
  'defaultValue': Type.Optional(Type.String()),
  'placeholder': Type.Optional(Type.String()),
  'error': Type.Optional(Type.Boolean()),
  'size': Type.Optional(StringUnion(['default', 'mini', 'small', 'large'])),
  'showWordLimit': Type.Optional(Type.Boolean())
};
