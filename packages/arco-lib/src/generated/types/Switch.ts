import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const SwitchPropsSpec = {
  defaultChecked: Type.Boolean({
    title: 'Default Checked',
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  type: StringUnion(['circle', 'round', 'line'], {
    title: 'Type',
    category: Category.Style,
  }),
  size: StringUnion(['small', 'default'], {
    title: 'Size',
    category: Category.Style,
  }),
  loading: Type.Boolean({
    title: 'Loading',
    category: Category.Basic,
  }),
};
