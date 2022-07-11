import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const NumberInputPropsSpec = {
  defaultValue: Type.Number({
    title: 'Default Value',
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  min: Type.Number({
    title: 'Min',
    category: Category.Basic,
  }),
  max: Type.Number({
    title: 'Max',
    category: Category.Basic,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Behavior,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  buttonMode: Type.Boolean({
    title: 'Button Mode',
    category: Category.Behavior,
  }),
  precision: Type.Number({
    title: 'Precision',
    category: Category.Behavior,
  }),
  step: Type.Number({
    title: 'Step',
    category: Category.Behavior,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  readOnly: Type.Boolean({
    title: 'Read Only',
    category: Category.Behavior,
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior,
  }),
};
