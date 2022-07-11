import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const SkeletonTextPropsSpec = {
  rows: Type.Number(),
  width: Type.Array(Type.Any(), {
    widget: 'core/v1/expression',
    description:
      `Enter an array, each element of which represents the width of each row from top to bottom.     
    ` +
      'For example, if we now have 3 rows, we can use the `[100,200,300]` to represent the width of each row',
  }),
};

export const SkeletonImagePropsSpec = {
  shape: StringUnion(['circle', 'square']),
  size: StringUnion(['small', 'default', 'large']),
  position: StringUnion(['left', 'right']),
};

export const SkeletonPropsSpec = {
  animation: Type.Boolean({
    title: 'Animation',
    category: Category.Basic,
  }),
  loading: Type.Boolean({
    title: 'Loading',
    category: Category.Basic,
  }),
  image: Type.Boolean({
    title: 'Image Placeholder',
    description: 'Whether to show the picture placeholder',
    category: Category.Basic,
  }),
  imageProps: Type.Object(SkeletonImagePropsSpec, {
    title: 'Image Config',
    category: Category.Basic,
    conditions: [{ key: 'image', value: true }],
  }),
  text: Type.Boolean({
    title: 'Text Placeholder',
    description: 'Whether to show text placeholder',
    category: Category.Basic,
  }),
  textProps: Type.Object(SkeletonTextPropsSpec, {
    title: 'Text Config',
    category: Category.Basic,
    conditions: [{ key: 'text', value: true }],
  }),
};
