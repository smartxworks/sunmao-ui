import { Type } from '@sinclair/typebox';
import { Category } from '../../constants/category';
import { StringUnion } from '../../sunmao-helper';


export const MentionsPropsSchema = {
  options: Type.Array(Type.String(), {
    title:'Options',
    weight: 3,
    category:Category.Data,
    widget:'expression'
  }),
  defaultValue: Type.String({
    title:'Default Value',
    weight: 2,
    category:Category.Data,
  }),
  prefix: Type.String({
    title:'Prefix',
    category:Category.Basic,
  }),
  placeholder: Type.String({
    title:'Placeholder',
    category:Category.Basic,
  }),
  disabled: Type.Boolean({
    title:'Disabled',
    category:Category.Basic,
  }),
  error: Type.Boolean({
    title:'Error',
    category:Category.Basic,
  }),
  allowClear: Type.Boolean({
    title:'Allow Clear',
    category:Category.Basic,
  }),
  split: Type.String({
    title:'Split',
    category:Category.Basic,
  }),
  position: StringUnion(['top', 'tl', 'tr', 'bottom', 'bl', 'br'], {
    title:'Position',
    category: Category.Layout
  })
}