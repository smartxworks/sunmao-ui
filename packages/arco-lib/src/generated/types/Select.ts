
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


export const SelectPropsSchema = {
  options: Type.Array(
    Type.Object({
      value: Type.String(),
      text: Type.String(),
      disabled: Type.Optional(Type.Boolean()),
    }),
    {
      category: Category.Data,
    }
  ),
  defaultValue: Type.String({
    category: Category.Data,
  }),
  inputValue: Type.String({
    category: Category.General,
    weight: 0
  }),
  mode: StringUnion(['multiple', 'tags'], {
    category: Category.General,
  }),
  labelInValue: Type.Boolean({
    category: Category.General,
  }),
  defaultActiveFirstOption: Type.Boolean({
    category: Category.Style,
    description: 'Whether to highlight the first option by default'
  }),
  unmountOnExit: Type.Boolean({
    category: Category.General,
  }),
  popupVisible: Type.Boolean({
    category: Category.General,
  }),
  placeholder: Type.String({
    category: Category.General,
    weight: 1
  }),
  bordered: Type.Boolean({
    category: Category.Style
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    category: Category.Style
  }),
  disabled: Type.Boolean({
    category: Category.General,
  }),
  error: Type.Boolean({
    category: Category.Style
  }),
  loading: Type.Boolean({
    category: Category.Style
  }),
  allowClear: Type.Boolean({
    category: Category.General,
  }),
  allowCreate: Type.Boolean({
    category: Category.General,
  }),
  animation: Type.Boolean({
    category: Category.Style
  })
};
