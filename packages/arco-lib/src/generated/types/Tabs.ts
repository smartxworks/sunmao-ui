import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const TabsPropsSpec = {
  defaultActiveTab: Type.String({
    title: 'Default Active Tab Index',
    category: Category.Basic,
    description: 'The index of default active Tab. Start with 0.',
  }),
  tabNames: Type.Array(Type.String(), {
    title: 'Tab Names',
    category: Category.Basic,
  }),
  type: StringUnion(['line', 'card', 'card-gutter', 'text', 'rounded', 'capsule'], {
    title: 'Style Type',
    category: Category.Basic,
  }),
  tabPosition: StringUnion(['left', 'right', 'top', 'bottom'], {
    title: 'Tab Position',
    category: Category.Basic,
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'], {
    title: 'Size',
    category: Category.Basic,
  }),
};
