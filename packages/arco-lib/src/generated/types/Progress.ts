import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const ProgressPropsSpec = {
  type: StringUnion(['line', 'circle'], {
    title: 'Type',
    category: Category.Basic,
  }),
  percent: Type.Number({
    title: 'Percent',
    category: Category.Basic,
  }),
  status: StringUnion(['success', 'error', 'normal', 'warning'], {
    title: 'Status',
    category: Category.Style,
  }),
  color: Type.String({
    title: 'Color',
    category: Category.Style,
    description:
      'Please pick a color from the palette, or enter a color value such as #c10',
    widget: 'core/v1/color',
    conditions: [
      {
        key: 'status',
        value: 'normal',
      },
    ],
  }),
  trailColor: Type.String({
    title: 'Trail Color',
    category: Category.Style,
    widget: 'core/v1/color',
  }),
  showText: Type.Boolean({
    title: 'Show Text',
    category: Category.Basic,
  }),
  width: Type.Number({
    title: 'Width',
    category: Category.Style,
  }),
  size: StringUnion(['small', 'default', 'mini', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  animation: Type.Boolean({
    title: 'Animation',
    category: Category.Behavior,
    conditions: [
      {
        key: 'type',
        value: 'line',
      },
    ],
  }),
};
