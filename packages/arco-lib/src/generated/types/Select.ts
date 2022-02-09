
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const SelectPropsSchema = {
  'inputValue': Type.String(),
  'mode': StringUnion(['multiple', 'tags']),
  'labelInValue': Type.Boolean(),
  'defaultActiveFirstOption': Type.Boolean(),
  'unmountOnExit': Type.Boolean(),
  'defaultPopupVisible': Type.Boolean(),
  'popupVisible': Type.Boolean(),
  'placeholder': Type.String(),
  'bordered': Type.Boolean(),
  'size': StringUnion(['default', 'mini', 'small', 'large']),
  'disabled': Type.Boolean(),
  'error': Type.Boolean(),
  'loading': Type.Boolean(),
  'allowClear': Type.Boolean(),
  'allowCreate': Type.Boolean(),
  'animation': Type.Boolean()
};
