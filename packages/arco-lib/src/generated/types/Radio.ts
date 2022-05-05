import { Type } from '@sinclair/typebox';
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category';

const RadioItemSpec = Type.Object({
  value: Type.String(),
  label: Type.String(),
  disabled: Type.Optional(Type.Boolean()),
});

export const RadioPropsSpec = {
  defaultCheckedValue: Type.String({
    category: Category.Data,
  }),
  options: Type.Array(RadioItemSpec, {
    category: Category.Data,
    widgetOptions:{
      displayedKeys: ['label'],
    }
  }),
  type: StringUnion(['radio', 'button'], {
    category: Category.Style,
  }),
  direction: StringUnion(['horizontal', 'vertical'], {
    category: Category.Style,
    conditions:[
      {
        key:'type',
        value:'radio'
      }
    ]
  }),
  size: StringUnion(['small', 'default', 'large', 'mini'], {
    category: Category.Style,
  }),
};
