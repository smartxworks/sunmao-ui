import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TreeNodeSpec = Type.Object({
  title: Type.String(),
  key: Type.String(),
  children: Type.Optional(Type.Array(Type.Any())),
  selectable: Type.Optional(Type.Boolean()),
  checkable: Type.Optional(Type.Boolean()),
});

export const TreePropsSpec = Type.Object({
  data: Type.Array(TreeNodeSpec, {
    category: Category.Data,
    title: 'Tree Data',
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['title'],
    },
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
    title: 'Auto Expand Parent',
  }),
  autoExpandParentWhenDataChanges: Type.Boolean({
    category: Category.Basic,
    title: 'Auto Expand Parent When Data Changes',
    conditions: [
      {
        key: 'autoExpandParent',
        value: true,
      },
    ],
  }),
  defaultExpandKeys: Type.Array(Type.String(), {
    category: Category.Basic,
    title: 'Expand Keys',
    conditions: [
      {
        key: 'autoExpandParent',
        value: false,
      },
    ],
  }),
});
