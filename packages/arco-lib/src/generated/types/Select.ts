import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const SelectPropsSpec = {
  defaultValue: Type.String({
    title: 'Default Value',
    category: Category.Basic,
    weight: 7,
  }),
  options: Type.Array(
    Type.Object({
      value: Type.String({
        title: 'Value',
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
      title: 'Options',
      category: Category.Basic,
      widget: 'core/v1/array',
      widgetOptions: {
        displayedKeys: ['value'],
      },
      weight: 8,
    }
  ),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
    weight: 6,
  }),
  multiple: Type.Boolean({
    title: 'Multiple',
    category: Category.Behavior,
  }),
  labelInValue: Type.Boolean({
    title: 'Label In Value',
    description:
      'Setting value format.The default is string, when set to true, the value format will turn to: { label: string, value: string }',
    category: Category.Behavior,
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
  }),
  bordered: Type.Boolean({
    title: 'Bordered',
    category: Category.Style,
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title: 'Size',
    category: Category.Style,
  }),
  disabled: Type.Boolean({
    title: 'Disabled',
    category: Category.Behavior,
    weight: 4,
  }),
  loading: Type.Boolean({
    title: 'Loading',
    category: Category.Behavior,
    weight: 3,
  }),
  showSearch: Type.Boolean({
    title: 'Enable Search',
    category: Category.Behavior,
  }),
  retainInputValue: Type.Optional(
    Type.Boolean({
      title: 'Retain Input Value',
      category: Category.Behavior,
      description: 'Retain the existing content when the search box is focused',
      conditions: [
        {
          key: 'showSearch',
          value: true,
        },
      ],
    })
  ),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
  }),
  allowCreate: Type.Boolean({
    title: 'Allow Create',
    category: Category.Behavior,
    description: 'Whether to allow new options to be created by input',
  }),
  showTitle: Type.Boolean({
    title: 'Show Option Title',
    description:
      'Whether to show the title on hover when the select option exceeds the width',
    category: Category.Behavior,
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior,
  }),
  unmountOnExit: Type.Boolean({
    title: 'Destroy On Hide',
    category: Category.Behavior,
  }),
  mountToBody: Type.Boolean({
    title: 'Mount To Body',
    category: Category.Behavior,
    description:
      'The default is to mount the popup to the body, setting it to false will mount it to the current select element',
  }),
  autoFixPosition: Type.Boolean({
    title: 'Auto Fix Position',
    category: 'Popup Props',
  }),
  autoAlignPopupMinWidth: Type.Boolean({
    title: 'Auto Align Popup Min Width',
    category: 'Popup Props',
  }),
  autoAlignPopupWidth: Type.Boolean({
    title: 'Auto Align Popup Width',
    category: 'Popup Props',
  }),
  autoFitPosition: Type.Boolean({
    title: 'Auto Fit Position',
    category: 'Popup Props',
  }),
  position: StringUnion(
    ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'],
    {
      title: 'Position',
      category: 'Popup Props',
    }
  ),
};
