import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

export const SelectPropsSpec = {
  defaultValue: Type.String({
    title: 'Default Value',
    category: Category.Data,
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
      category: Category.Data
    }
  ),
  multiple: Type.Boolean({
    title: 'Multiple',
    category: Category.Basic,
  }),
  labelInValue: Type.Boolean({
    title: 'Label In Value',
    description:
      'Setting value format.The default is string, when set to true, the value format will turn to: { label: string, value: string }',
  }),
  placeholder: Type.String({
    title: 'Placeholder',
    category: Category.Basic,
    weight: 5,
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
    category: Category.Basic,
    weight: 4,
  }),
  loading: Type.Boolean({
    title: 'Loading',
    category: Category.Basic,
    weight: 3,
  }),
  showSearch: Type.Boolean({
    title: 'Enable Search',
    category: Category.Behavior,
  }),
  retainInputValue: Type.Optional(Type.Boolean({
    title: 'Retain Input Value',
    category: Category.Behavior,
    description: 'Retain the existing content when the search box is focused',
    conditions: [
      {
        key: 'showSearch',
        value: true
      }
    ]
  })),
  allowClear: Type.Boolean({
    title: 'Allow Clear',
    category: Category.Behavior,
  }),
  allowCreate: Type.Boolean({
    title: 'Allow Create',
    category: Category.Behavior,
    description: 'Whether to allow new options to be created by input',
  }),
  error: Type.Boolean({
    title: 'Error',
    category: Category.Behavior
  }),
  unmountOnExit: Type.Boolean({
    title: 'Unmount On Exit',
    category: Category.Behavior,
  })
};
