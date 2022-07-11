import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

const RadioItemSpec = Type.Object({
  value: Type.String(),
  label: Type.String(),
  disabled: Type.Optional(Type.Boolean()),
});

export const RadioPropsSpec = {
  options: Type.Array(RadioItemSpec, {
    title: 'Options',
    category: Category.Basic,
    widget: 'core/v1/array',
    widgetOptions: {
      displayedKeys: ['label'],
    },
  }),
  defaultCheckedValue: Type.String({
    title: 'Default Value',
    category: Category.Basic,
  }),
  type: StringUnion(['radio', 'button'], {
    title: 'Type',
    category: Category.Basic,
  }),
  updateWhenDefaultValueChanges: Type.Boolean({
    title: 'Update When Default Value Changes',
    category: Category.Basic,
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    title: 'Direction',
    category: Category.Style,
    conditions: [
      {
        key: 'type',
        value: 'radio',
      },
    ],
  }),
  size: StringUnion(['small', 'default', 'large', 'mini'], {
    title: 'Size',
    category: Category.Style,
  }),
};
