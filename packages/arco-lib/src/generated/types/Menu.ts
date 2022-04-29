import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

// TODO properties can be further optimise and supplemented
export const MenuPropsSpec = {
  // theme: StringUnion(['dark', 'light'], {
  //   title: 'theme',
  //   category: Category.Style,
  // }),
  mode: StringUnion(['vertical', 'horizontal'], {
    title: 'Mode',
    category: Category.Basic
  }),
  items: Type.Array(
    Type.Object({
      key: Type.String(),
      text: Type.String(),
      disabled: Type.Optional(Type.Boolean()),
    }),
    {
      title:'Items',
      category: Category.Basic,
    }
  ),
  defaultActiveKey: Type.String({
    title: 'Default Active Key',
    category: Category.Basic,
  }),
  autoOpen: Type.Boolean({
    title: 'Auto Open',
    description: 'Whether to expand all multi-level menus by default',
    category: Category.Basic
  }),
  collapse: Type.Boolean({
    title: 'Collapse',
    category: Category.Style,
  }),
  // accordion: Type.Boolean({
  //   category: Category.Style,
  // }),
  ellipsis: Type.Boolean({
    title: 'Ellipsis',
    description: 'Whether the horizontal menu automatically collapses when it overflows',
    category: Category.Basic
  }),
  autoScrollIntoView: Type.Boolean({
    title: 'Auto Scroll Into View',
    category: Category.Basic
  }),
  hasCollapseButton: Type.Boolean({
    title: 'Collapse Button',
    category: Category.Basic
  }),
};
