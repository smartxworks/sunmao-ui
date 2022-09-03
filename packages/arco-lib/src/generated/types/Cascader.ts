import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';
import { CORE_VERSION, CoreWidgetName } from '@sunmao-ui/shared';

const EXPRESSION_WIDGET_TYPE = `${CORE_VERSION}/${CoreWidgetName.Expression}` as const;

export const CascaderValueSpec = Type.Union(
  [Type.Array(Type.String()), Type.Array(Type.Array(Type.String()))],
  {
    title: 'Default Value',
    category: Category.Data,
    widget: EXPRESSION_WIDGET_TYPE,
  }
);

export const CascaderPropsSpec = {
  options: Type.Array(Type.Array(Type.String()), {
    title: 'Options',
    weight: 10,
    description: `An array of arrays`,
    category: Category.Data,
    widget: EXPRESSION_WIDGET_TYPE,
  }),
  expandTrigger: StringUnion(['click', 'hover'], {
    title: 'Expand Trigger',
    category: Category.Basic,
  }),
  multiple: Type.Boolean({
    title: 'Multiple',
    category: Category.Basic,
  }),
  showSearch: Type.Boolean({
    title: 'Show Search',
    category: Category.Basic,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    weight: 1,
    category: Category.Basic,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  loading: Type.Boolean({
    title: 'Loading',
    category: Category.Basic,
  }),
  bordered: Type.Boolean({
    title: 'Bordered',
    category: Category.Style,
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Basic,
  }),
  allowCreate: Type.Boolean({
    title: 'Allow Create',
    category: Category.Basic,
  }),
  maxTagCount: Type.Number({
    title: 'Max Tag Count',
    category: Category.Basic,
  }),
  defaultValue: CascaderValueSpec,
};
