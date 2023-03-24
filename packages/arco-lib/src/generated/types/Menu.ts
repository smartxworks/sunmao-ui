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
    category: Category.Basic,
  }),
  items: Type.Array(
    Type.Object({
      key: Type.String({
        title: 'Key',
      }),
      text: Type.String({
        title: 'Text',
      }),
      disabled: Type.Optional(
        Type.Boolean({
          title: 'Disabled',
        })
      ),
    }),
    {
      title: 'Items',
      category: Category.Basic,
      widget: 'core/v1/array',
      widgetOptions: {
        displayedKeys: ['text'],
      },
    }
  ),
  defaultActiveKey: Type.String({
    title: 'Default Active Key',
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  autoOpen: Type.Boolean({
    title: 'Auto Open',
    description: 'Whether to expand all multi-level menus by default',
    category: Category.Behavior,
  }),
  hasCollapseButton: Type.Boolean({
    title: 'Collapse Button',
    category: Category.Behavior,
    conditions: [{ key: 'mode', value: 'vertical' }],
  }),
  collapse: Type.Boolean({
    title: 'Collapse',
    category: Category.Behavior,
    conditions: [
      {
        and: [
          { key: 'mode', value: 'vertical' },
          { key: 'hasCollapseButton', value: false },
        ],
      },
    ],
  }),
  // accordion: Type.Boolean({
  //   category: Category.Style,
  // }),
  ellipsis: Type.Boolean({
    title: 'Ellipsis',
    description: 'Whether the horizontal menu automatically collapses when it overflows',
    category: Category.Behavior,
    conditions: [{ key: 'mode', value: 'horizontal' }],
  }),
  autoScrollIntoView: Type.Boolean({
    title: 'Auto Scroll Into View',
    category: Category.Behavior,
  }),
};
