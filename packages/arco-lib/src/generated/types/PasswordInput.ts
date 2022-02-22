
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const PasswordInputPropsSchema = {
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
    weight: 1
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title: 'Size',
    category: Category.Style
  }),
  visibilityToggle: Type.Boolean({
    title: 'Visibility Toggle',
    description: 'Show a toggle to make the password text visible',
    category:Category.Basic
  }),
  error: Type.Boolean({
    title:'Error',
    category:Category.Basic,
  }),
};
