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
    category: Category.Style,
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    category: Category.Style,
  }),
  mode: StringUnion(['left', 'right', 'alternate'], {
    category: Category.Style,
  }),
  labelPosition: StringUnion(['relative', 'same'], {
    category: Category.Style,
  }),
};
