import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const StepItemSpec = Type.Object({
  title: Type.String({
    title: 'Title',
  }),
  description: Type.String({
    title: 'Description',
  }),
});

export const StepsPropsSpec = {
  type: StringUnion(['default', 'arrow', 'dot', 'navigation'], {
    title: 'Type',
    category: Category.Basic,
  }),
  current: Type.Number({
    title: 'Current Step',
    category: Category.Basic,
  }),
  size: StringUnion(['default', 'small'], {
    title: 'Size',
    category: Category.Style,
  }),
  direction: StringUnion(['vertical', 'horizontal'], {
    title: 'Direction',
    category: Category.Layout,
    conditions: [
      {
        or: [
          {
            key: 'type',
            value: 'default',
          },
          {
            key: 'type',
            value: 'dot',
          },
        ],
      },
    ],
  }),
  status: StringUnion(['wait', 'process', 'finish', 'error'], {
    title: 'Status',
    category: Category.Style,
  }),
  lineless: Type.Boolean({
    title: 'Lineless',
    category: Category.Style,
  }),
  items: Type.Array(StepItemSpec, {
    title: 'Items',
    category: Category.Basic,
    weight: 10,
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['title'],
    },
  }),
};
