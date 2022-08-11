import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

const EXPRESSION_WIDGET_TYPE = `${CORE_VERSION}/${CoreWidgetName.Expression}` as const;

export const MentionsPropsSpec = {
  options: Type.Array(Type.String(), {
    title: 'Options',
    weight: 3,
    category: Category.Basic,
    widget: EXPRESSION_WIDGET_TYPE,
  }),
  defaultValue: Type.String({
    title: 'Default Value',
    weight: 2,
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  prefix: Type.String({
    title: 'Prefix',
    category: Category.Behavior,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior,
  }),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
  }),
  split: Type.String({
    title: 'Split',
    category: Category.Behavior,
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title: 'Position',
    category: Category.Layout,
  }),
};
