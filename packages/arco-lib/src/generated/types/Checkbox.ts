import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';
import { EXPRESSION_WIDGET_TYPE } from '../../constants/widget';

export const CheckboxOptionSpec = Type.Array(
  Type.Object({
    label: Type.String(),
    value: Type.String(),
    disabled: Type.Boolean(),
    indeterminate: Type.Boolean(),
  }),
  {
    title: 'Options',
    category: Category.Data,
    widgetOptions: {
      displayedKeys: ['label'],
    },
  }
);

export const CheckboxPropsSpec = {
  options: CheckboxOptionSpec,
  defaultCheckedValues: Type.Array(Type.String(), {
    title: 'Default Value',
    category: Category.Data,
    widget: EXPRESSION_WIDGET_TYPE,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    title: 'Direction',
    category: Category.Basic,
  }),
  showCheckAll: Type.Boolean({
    title: 'Show Check All',
    category: Category.Basic,
  }),
  checkAllText: Type.String({
    title: 'Check All Text',
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
};
