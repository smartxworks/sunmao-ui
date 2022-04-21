import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const SiderPropsSpec = {
  theme: StringUnion(['dark', 'light'], {
    category: Category.Style,
  }),
  collapsed: Type.Boolean({
    category: Category.Style,
  }),
  collapsible: Type.Boolean({
    category: Category.Style,
  }),
  collapsedWidth: Type.Number({
    category: Category.Style,
  }),
  reverseArrow: Type.Boolean({
    category: Category.Style,
  }),
  breakpoint: StringUnion(['xxl', 'xl', 'lg', 'md', 'sm', 'xs'], {
    Description: 'Breakpoint in responsive layout',
    category: Category.Layout,
  }),
};
