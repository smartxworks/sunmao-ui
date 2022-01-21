
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const ButtonPropsSchema = {
  'text': Type.Optional(Type.String()),
  'htmlType': Type.Optional(StringUnion(['button', 'submit', 'reset'])),
  'type': Type.Optional(StringUnion(['default', 'primary', 'secondary', 'dashed', 'text', 'outline'])),
  'status': Type.Optional(StringUnion(['default', 'warning', 'danger', 'success'])),
  'size': Type.Optional(StringUnion(['default', 'mini', 'small', 'large'])),
  'shape': Type.Optional(StringUnion(['circle', 'round', 'square'])),
  'href': Type.Optional(Type.String()),
  'target': Type.Optional(Type.String()),
  'disabled': Type.Optional(Type.Boolean()),
  'loading': Type.Optional(Type.Boolean()),
  'loadingFixedWidth': Type.Optional(Type.Boolean()),
  'iconOnly': Type.Optional(Type.Boolean()),
  'long': Type.Optional(Type.Boolean())
};
