import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const PasswordInputPropsSpec = {
  defaultValue: Type.String({
    title: 'Default Value',
    category: Category.Basic,
    weight: 0,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
    weight: 1,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  visibilityToggle: Type.Boolean({
    title: 'Visibility Toggle',
    description: 'Show a toggle to make the password text visible',
    category: Category.Behavior,
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior,
  }),
};
