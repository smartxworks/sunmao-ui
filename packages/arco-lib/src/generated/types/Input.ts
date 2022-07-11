import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const InputPropsSpec = {
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
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  readOnly: Type.Boolean({
    title: 'Read Only',
    category: Category.Behavior,
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
};
