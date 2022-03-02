
import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from '../../sunmao-helper';

export const DropdownPropsSchema = {
  dropdownType: StringUnion(['default', 'button'], {
    title:'Type',
    category: Category.Basic
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title:'Position',
    category: Category.Layout
  }),
  trigger: StringUnion(['hover', 'click'], {
    title:'Trigger',
    category: Category.Basic
  }),
  disabled: Type.Boolean({
    title:'Disabled',
    category: Category.Basic
  }),
  defaultPopupVisible: Type.Boolean({
    title:'Default Visible',
    category: Category.Basic
  }),
  list: Type.Array(Type.Object({
    key: Type.String({
      title:'Key'
    }),
    label: Type.String({
      title:'Label'
    }),
  }), {
    title:'List',
    category: Category.Basic,
    weight: 10
  })
};
