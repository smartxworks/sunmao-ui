
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const ButtonPropsSchema = {
  text: Type.String({
    title:'Text',
    category:Category.Basic,
  }),
  type: StringUnion(['default', 'primary', 'secondary', 'dashed', 'text', 'outline'], {
    title:'Type',
    category: Category.Style
  }),
  status: StringUnion(['default', 'warning', 'danger', 'success'], {
    title:'Status',
    category: Category.Style
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    title:'Size',
    category: Category.Style
  }),
  shape: StringUnion(['circle', 'round', 'square'], {
    title:'Shape',
    category: Category.Style
  }),
  disabled: Type.Boolean({
    title:'Disabled',
    category:Category.Basic
  }),
  loading: Type.Boolean({
    title:'Loading',
    category:Category.Basic
  }),
  long: Type.Boolean({
    title:'Long',
    description:'Whether the width of the button should adapt to the container',
    category: Category.Basic
  })
};
