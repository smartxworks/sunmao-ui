import {Type} from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';

export const CheckboxOptionSchema = Type.Array(
  Type.Object({
    label: Type.String(),
    value: Type.String(),
    disabled: Type.Boolean(),
    indeterminate: Type.Boolean(),
  }),{
    category:Category.Data
  }
);

export const CheckboxPropsSchema = {
  options: CheckboxOptionSchema,
  direction: StringUnion(['horizontal', 'vertical'],{
    category:Category.Layout
  }),
  defaultCheckedValues: Type.Array(Type.String(),{
    category:Category.Data
  }),
  showCheckAll: Type.Boolean({
    category:Category.General
  }),
  checkAllText: Type.String({
    category:Category.Data
  }),
};
