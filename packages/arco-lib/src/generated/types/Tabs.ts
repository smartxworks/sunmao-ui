import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const TabsPropsSchema = {
  tabNames: Type.Array(Type.String(), {
    title: 'Tab Names',
  }),
  defaultActiveTab: Type.String({
    title: 'Default Active Tab',
    category: Category.Basic,
  }),
  tabPosition: StringUnion(['left', 'right', 'top', 'bottom'], {
    title: 'Tab Position',
    category: Category.Layout,
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  type: StringUnion(['line', 'card', 'card-gutter', 'text', 'rounded', 'capsule'], {
    title: 'Type',
    category: Category.Style,
  }),
};
