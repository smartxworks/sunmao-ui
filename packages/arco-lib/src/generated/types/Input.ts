
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const InputPropsSchema = {
  defaultValue: Type.String({
    title:'Default Value',
    category:Category.Basic,
    weight: 0
  }),
  placeholder: Type.String({
    title:'Placeholder',
    category:Category.Basic,
    weight: 1
  }),
  allowClear: Type.Boolean({
    title:'Allow Clear',
    category:Category.Basic,
  }),
  disabled: Type.Boolean({
    title:'Disabled',
    category:Category.Basic,
  }),
  readOnly: Type.Boolean({
    title:'Read Only',
    category:Category.Basic,
  }),
  error: Type.Boolean({
    title:'Error',
    category:Category.Basic,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title:'Size',
    category: Category.Style
  }),
};
