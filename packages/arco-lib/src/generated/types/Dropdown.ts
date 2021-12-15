
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const DropdownPropsSchema = {
  'position': Type.Optional(StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'])),
  'disabled': Type.Optional(Type.Boolean()),
  'unmountOnExit': Type.Optional(Type.Boolean()),
  'defaultPopupVisible': Type.Optional(Type.Boolean()),
  'popupVisible': Type.Optional(Type.Boolean())
};
