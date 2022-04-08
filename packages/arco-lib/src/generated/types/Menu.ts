import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

// TODO properties can be further optimise and supplemented
export const MenuPropsSpec = {
  // theme: StringUnion(['dark', 'light'], {
  //   title: 'theme',
  //   category: Category.Style,
  // }),
  mode: StringUnion(['vertical', 'horizontal']),
  autoOpen: Type.Boolean({
    description: 'Whether to expand all multi-level menus by default',
  }),
  collapse: Type.Boolean({
    category: Category.Style,
  }),
  // accordion: Type.Boolean({
  //   category: Category.Style,
  // }),
  // ellipsis: Type.Boolean({
  //   description: 'Whether the horizontal menu automatically collapses when it overflows',
  // }),
  autoScrollIntoView: Type.Boolean(),
  hasCollapseButton: Type.Boolean(),
};
