
import { Type } from "@sinclair/typebox";
import { Category } from "src/constants/category";
import { StringUnion } from '../../sunmao-helper';

export const DropdownPropsSchema = {
  dropdownType: StringUnion(['default', 'button'], {
    category: Category.Style
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    category: Category.Layout
  }),
  trigger: StringUnion(['hover', 'click'], {
    category: Category.General
  }),
  disabled: Type.Boolean({
    category: Category.General
  }),
  unmountOnExit: Type.Boolean({
    category: Category.General
  }),
  defaultPopupVisible: Type.Boolean({
    category: Category.General
  }),
  list: Type.Array(Type.Object({
    key: Type.String(),
    label: Type.String(),
  }), {
    category: Category.General,
    weight: 0
  })
};
