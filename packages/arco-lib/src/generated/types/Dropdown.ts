import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const DropdownPropsSpec = {
  text: Type.String({
    title: 'Text',
    category: Category.Basic,
  }),
  dropdownType: StringUnion(['default', 'button'], {
    title: 'Type',
    category: Category.Basic,
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title: 'Position',
    category: Category.Layout,
  }),
  trigger: StringUnion(['hover', 'click'], {
    title: 'Trigger',
    category: Category.Behavior,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
  }),
  defaultPopupVisible: Type.Boolean({
    title: 'Default Visible',
    category: Category.Behavior,
  }),
  autoAlignPopupWidth: Type.Boolean({
    title: 'Auto Align Popup Width',
    category: Category.Behavior,
  }),
  unmountOnExit: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
  list: Type.Array(
    Type.Object({
      key: Type.String({
        title: 'Key',
      }),
      label: Type.String({
        title: 'Label',
      }),
    }),
    {
      title: 'List',
      category: Category.Basic,
      widget: 'core/v1/array',
      widgetOptions: {
        displayedKeys: ['label'],
      },
      weight: 10,
    }
  ),
};
