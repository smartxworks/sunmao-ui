import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const TimelineItemPropsSpec = {
  label: Type.String(),
  content: Type.String(),
  dotColor: Type.String(),
  lineType: StringUnion(['solid', 'dashed', 'dotted']),
  lineColor: Type.String(),
  dotType: StringUnion(['hollow', 'solid']),
};

export const TimelinePropsSpec = {
  items: Type.Array(Type.Object(TimelineItemPropsSpec), {
    category: Category.Data,
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
        value: 'alternate'
      }
    ]
  }),
};
