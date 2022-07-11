import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const TimelineItemPropsSpec = {
  label: Type.String({
    title: 'Label',
  }),
  content: Type.String({
    title: 'Content',
  }),
  dotColor: Type.String({
    title: 'Dot Color',
    widget: 'core/v1/color',
  }),
  lineType: StringUnion(['solid', 'dashed', 'dotted'], {
    title: 'Line Type',
  }),
  lineColor: Type.String({
    title: 'Line Color',
    widget: 'core/v1/color',
  }),
  dotType: StringUnion(['hollow', 'solid'], {
    title: 'Dot Type',
  }),
};

export const TimelinePropsSpec = {
  items: Type.Array(Type.Object(TimelineItemPropsSpec), {
    category: Category.Data,
    title: 'Items',
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['label'],
    },
  }),
  reverse: Type.Boolean({
    category: Category.Behavior,
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    category: Category.Layout,
  }),
  mode: StringUnion(['left', 'right', 'alternate'], {
    category: Category.Layout,
  }),
  labelPosition: StringUnion(['relative', 'same'], {
    category: Category.Layout,
    conditions: [
      {
        key: 'mode',
        value: 'alternate',
      },
    ],
  }),
};
