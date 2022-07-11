import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const SpacePropsSpec = {
  align: StringUnion(['start', 'end', 'center', 'baseline'], {
    title: 'Align',
    category: Category.Layout,
  }),
  direction: StringUnion(['vertical', 'horizontal'], {
    title: 'Direction',
    category: Category.Layout,
  }),
  wrap: Type.Boolean({
    title: 'Wrap',
    category: Category.Layout,
  }),
  size: Type.Number({
    title: 'Size',
    category: Category.Layout,
  }),
};
