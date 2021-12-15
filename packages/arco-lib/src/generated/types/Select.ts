
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const SelectPropsSchema = {
  'inputValue': Type.Optional(Type.String()),
  'mode': Type.Optional(StringUnion(['multiple', 'tags'])),
  'labelInValue': Type.Optional(Type.Boolean()),
  'defaultActiveFirstOption': Type.Optional(Type.Boolean()),
  'unmountOnExit': Type.Optional(Type.Boolean()),
  'defaultPopupVisible': Type.Optional(Type.Boolean()),
  'popupVisible': Type.Optional(Type.Boolean()),
  'placeholder': Type.Optional(Type.String()),
  'bordered': Type.Optional(Type.Boolean()),
  'size': Type.Optional(StringUnion(['default', 'mini', 'small', 'large'])),
  'disabled': Type.Optional(Type.Boolean()),
  'error': Type.Optional(Type.Boolean()),
  'loading': Type.Optional(Type.Boolean()),
  'allowClear': Type.Optional(Type.Boolean()),
  'allowCreate': Type.Optional(Type.Boolean()),
  'animation': Type.Optional(Type.Boolean())
};
