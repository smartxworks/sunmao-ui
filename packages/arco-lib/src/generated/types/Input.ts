
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const InputPropsSchema = {
  'allowClear': Type.Boolean(),
  'disabled': Type.Boolean(),
  'readOnly': Type.Boolean(),
  'defaultValue': Type.String(),
  'placeholder': Type.String(),
  'error': Type.Boolean(),
  'size': StringUnion(['default', 'mini', 'small', 'large']),
  'showWordLimit': Type.Boolean()
};
