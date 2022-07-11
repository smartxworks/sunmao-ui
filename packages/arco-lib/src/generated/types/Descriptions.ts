import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const dataPropsSpec = Type.Object({
  label: Type.String({
    title: 'Label',
  }),
  value: Type.String({
    title: 'Value',
  }),
  span: Type.Optional(
    Type.Number({
      title: 'Span',
    })
  ),
});
export const DescriptionPropsSpec = {
  data: Type.Array(dataPropsSpec, {
    title: 'Data',
    category: Category.Basic,
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['label'],
    },
  }),
  column: Type.Number({
    title: 'Column',
    category: Category.Basic,
  }),
  title: Type.String({
    title: 'Title',
    category: Category.Basic,
  }),
  layout: StringUnion(
    ['horizontal', 'vertical', 'inline-horizontal', 'inline-vertical'],
    {
      title: 'Layout',
      category: Category.Layout,
    }
  ),
  size: StringUnion(['mini', 'small', 'medium', 'default', 'large'], {
    title: 'Layout',
    category: Category.Layout,
  }),
  tableLayout: StringUnion(['auto', 'fixed'], {
    title: 'Layout',
    category: Category.Layout,
  }),
  colon: Type.String({
    title: 'Colon',
    category: Category.Basic,
  }),
  border: Type.Boolean({
    title: 'border',
    category: Category.Style,
  }),
};
