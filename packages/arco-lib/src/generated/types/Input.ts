
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const InputPropsSchema = {
  defaultValue: Type.String({
    category:Category.General,
    weight: 0
  }),
  placeholder: Type.String({
    category:Category.General,
    weight: 1
  }),
  allowClear: Type.Boolean({
    category:Category.General,
  }),
  disabled: Type.Boolean({
    category:Category.General,
  }),
  readOnly: Type.Boolean({
    category:Category.General,
  }),
  error: Type.Boolean({
    category:Category.General,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    category: Category.Style
  }),
};
