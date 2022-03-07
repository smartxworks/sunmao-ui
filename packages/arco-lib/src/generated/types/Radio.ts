
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'


const RadioItemSchema = Type.Object({
  value: Type.String(),
  label: Type.String(),
  disabled: Type.Boolean()
});

export const RadioPropsSchema = {
  options: Type.Array(RadioItemSchema, {
    category: Category.Data
  }),
  defaultCheckedValue: Type.String({
    category: Category.Data
  }),
  type: StringUnion(['radio', 'button'], {
    category: Category.Style
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    category: Category.Style
  }),
  size: StringUnion(['small', 'default', 'large', 'mini'], {
    category: Category.Style
  }),
};
