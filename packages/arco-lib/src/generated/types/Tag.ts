import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const TagPropsSpec = {
  content: Type.String({
    title: 'Content',
    category: Category.Basic,
  }),
  closable: Type.Boolean({
    title: 'Closable',
    category: Category.Behavior,
  }),
  checkable: Type.Boolean({
    title: 'Checkable',
    category: Category.Behavior,
  }),
  defaultChecked: Type.Boolean({
    title: 'Default Checked',
    category: Category.Behavior,
    conditions: [{ key: 'checkable', value: true }],
  }),
  defaultVisible: Type.Boolean({
    title: 'Default Visible',
    category: Category.Behavior,
  }),
  color: Type.String({
    title: 'Color',
    category: Category.Style,
    widget: 'core/v1/color',
  }),
  size: StringUnion(['large', 'medium', 'default', 'small'], {
    title: 'Size',
    category: Category.Style,
  }),
  bordered: Type.Boolean({
    title: 'Bordered',
    category: Category.Style,
  }),
};
