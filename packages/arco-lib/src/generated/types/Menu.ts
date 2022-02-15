
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

// TODO properties can be further optimised and supplemented
export const MenuPropsSchema = {
  theme: StringUnion(['dark', 'light'], {
    title:'theme',
    category: Category.Style
  }),
  mode: StringUnion(['vertical', 'horizontal', 'pop', 'popButton'], {
    category: Category.Style
  }),
  autoOpen: Type.Boolean({
    description: 'Whether to expand all multi-level menus by default'
  }),
  collapse: Type.Boolean({
    category: Category.Style
  }),
  accordion: Type.Boolean({
    category: Category.Style
  }),
  selectable: Type.Boolean(),
  ellipsis: Type.Boolean({
    category: Category.Style,
    description: 'Whether the horizontal menu automatically collapses when it overflows'
  }),
  autoScrollIntoView: Type.Boolean(),
  hasCollapseButton: Type.Boolean()
};
