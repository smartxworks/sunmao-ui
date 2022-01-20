
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const DropdownPropsSchema = {
  'dropdownType': StringUnion(['default', 'button']),
  'position': Type.Optional(StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'])),
  'trigger': StringUnion(['hover', 'click']),
  'disabled': Type.Optional(Type.Boolean()),
  'unmountOnExit': Type.Optional(Type.Boolean()),
  'defaultPopupVisible': Type.Optional(Type.Boolean()),
  'list': Type.Optional(Type.Array(Type.Object({
    key: Type.String(),
    label: Type.String(),
  })))
};
