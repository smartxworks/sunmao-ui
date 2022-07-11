import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const TabsPropsSpec = {
  defaultActiveTab: Type.Number({
    title: 'Default Active Tab',
    category: Category.Basic,
    description: 'The index of default active Tab. Start with 0.',
  }),
  tabs: Type.Array(
    Type.Object({
      title: Type.String({
        title: 'Title',
      }),
      hidden: Type.Boolean({
        title: 'Hidden',
      }),
      destroyOnHide: Type.Boolean({
        title: 'Destroy On Hide',
      }),
    }),
    {
      title: 'Tabs',
      category: Category.Basic,
      widget: 'core/v1/array',
      widgetOptions: {
        displayedKeys: ['title'],
      },
    }
  ),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
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
