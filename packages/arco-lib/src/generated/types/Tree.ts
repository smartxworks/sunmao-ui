import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TreeNodeSpec = Type.Object({
  title: Type.String(),
  key: Type.String(),
  children: Type.Optional(Type.Array(Type.Any())),
  selectable: Type.Optional(Type.Boolean()),
  checkable: Type.Optional(Type.Boolean()),
  path: Type.Optional(Type.Array(Type.String())),
});

export const TreePropsSpec = Type.Object({
  data: Type.Array(TreeNodeSpec, {
    category: Category.Data,
    title: 'Tree Data',
  }),
  size: StringUnion(['mini', 'small', 'medium', 'large'], {
    category: Category.Style,
    title: 'Size',
  }),
  multiple: Type.Boolean({
    category: Category.Basic,
    title: 'Multiple Select',
  }),
  autoExpandParent: Type.Boolean({
    category: Category.Basic,
    title: 'Auto Expand Node',
  }),
});
