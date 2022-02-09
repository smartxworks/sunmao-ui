
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const ButtonPropsSchema = {
  'text': Type.String(),
  'htmlType': StringUnion(['button', 'submit', 'reset']),
  'type': StringUnion(['default', 'primary', 'secondary', 'dashed', 'text', 'outline']),
  'status': StringUnion(['default', 'warning', 'danger', 'success']),
  'size': StringUnion(['default', 'mini', 'small', 'large']),
  'shape': StringUnion(['circle', 'round', 'square']),
  'href': Type.String(),
  'target': Type.String(),
  'disabled': Type.Boolean(),
  'loading': Type.Boolean(),
  'loadingFixedWidth': Type.Boolean(),
  'iconOnly': Type.Boolean(),
  'long': Type.Boolean()
};
