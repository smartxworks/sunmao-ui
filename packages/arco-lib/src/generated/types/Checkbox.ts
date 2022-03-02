import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CheckboxOptionSchema = Type.Array(
  Type.Object({
    label: Type.String(),
    value: Type.String(),
    disabled: Type.Boolean(),
    indeterminate: Type.Boolean(),
  }), {
  title: 'Options',
  category: Category.Data,
  widget: 'expression'
}
);

export const CheckboxPropsSchema = {
  options: CheckboxOptionSchema,
  direction: StringUnion(['horizontal', 'vertical'], {
    title: 'Direction',
    category: Category.Layout
  }),
  defaultCheckedValues: Type.Array(Type.String(), {
    title: 'Default Value',
    category: Category.Data,
  }),
  showCheckAll: Type.Boolean({
    title: 'Show Check All',
    category: Category.Basic
  }),
  checkAllText: Type.String({
    title: 'Check All Text',
    category: Category.Data
  }),
};
