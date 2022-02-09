
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const DropdownPropsSchema = {
  'dropdownType': StringUnion(['default', 'button']),
  'position': StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br']),
  'trigger': StringUnion(['hover', 'click']),
  'disabled': Type.Boolean(),
  'unmountOnExit': Type.Boolean(),
  'defaultPopupVisible': Type.Boolean(),
  'list': Type.Array(Type.Object({
    key: Type.String(),
    label: Type.String(),
  }))
};
