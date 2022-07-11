import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const RowPropsSpec = {
  gutter: Type.Number({
    title: 'Gutter',
    category: Category.Layout,
  }),
  align: StringUnion(['start', 'center', 'end', 'stretch'], {
    title: 'Align',
    category: Category.Layout,
    description: 'Vertical alignment, same as css align-items',
  }),
  justify: StringUnion(['start', 'center', 'end', 'space-around', 'space-between'], {
    title: 'Justify',
    category: Category.Layout,
    description: 'Horizontal alignment, same as css justify-content',
  }),
};

export const ColPropsSpec = {
  offset: Type.Number({
    title: 'Offset',
    category: Category.Layout,
  }),
  pull: Type.Number({
    title: 'Pull',
    category: Category.Layout,
  }),
  push: Type.Number({
    title: 'Push',
    category: Category.Layout,
  }),
  span: Type.Number({
    title: 'Span',
    category: Category.Layout,
  }),
  order: Type.Number({
    title: 'Order',
    category: Category.Layout,
  }),
};
