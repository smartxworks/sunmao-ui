import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CollapseItemPropsSpec = {
  key: Type.String({
    title: 'Key',
    category: Category.Basic,
    weight: 2,
  }),
  header: Type.String({
    title: 'Header',
    category: Category.Basic,
    weight: 1,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Basic,
  }),
  showExpandIcon: Type.Boolean({
    title: 'Show Expand Icon',
    category: Category.Basic,
  }),
  destroyOnHide: Type.Optional(
    Type.Boolean({
      title: 'Destroy On Hide',
    })
  ),
};

export const CollapsePropsSpec = {
  defaultActiveKey: Type.Array(Type.String(), {
    title: 'Default Active Key',
    category: Category.Basic,
    widget: 'core/v1/expression',
  }),
  accordion: Type.Boolean({
    title: 'Accordion',
    category: Category.Style,
  }),
  expandIconPosition: StringUnion(['left', 'right'], {
    title: 'Expand Icon Position',
    category: Category.Layout,
  }),
  bordered: Type.Boolean({
    title: 'Bordered',
    category: Category.Style,
  }),
  options: Type.Array(Type.Object(CollapseItemPropsSpec), {
    title: 'Options',
    category: Category.Basic,
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['header'],
    },
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  lazyLoad: Type.Boolean({
    title: 'Lazy Load',
    description: 'If true, invisible panels will not be rendered on mount',
    category: Category.Behavior,
  }),
  destroyOnHide: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
};
