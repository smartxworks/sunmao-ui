import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';


export const MentionsPropsSchema = {
  options: Type.Array(Type.String(), {
    weight: 0,
    category:Category.Data
  }),
  defaultValue: Type.String({
    weight: 1,
    category:Category.Data
  }),
  prefix: Type.String({
    category:Category.General,
  }),
  placeholder: Type.String({
    category:Category.General,

  }),
  disabled: Type.Boolean({
    category:Category.General,
  }),
  error: Type.Boolean({
    category:Category.General,
  }),
  allowClear: Type.Boolean({
    category:Category.General,
  }),
  split: Type.String({
    category:Category.General,
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    category: Category.Layout
  })
}