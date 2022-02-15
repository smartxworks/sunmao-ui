
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { Category } from '../../constants/category'

export const ButtonPropsSchema = {
  text: Type.String({
    category:Category.General,
  }),
  htmlType: StringUnion(['button', 'submit', 'reset'],{
    category:Category.General,
  }),
  type: StringUnion(['default', 'primary', 'secondary', 'dashed', 'text', 'outline'], {
    category: Category.Style
  }),
  status: StringUnion(['default', 'warning', 'danger', 'success'], {
    category: Category.Style
  }),
  size: StringUnion(['default', 'mini', 'small', 'large'], {
    category: Category.Style
  }),
  shape: StringUnion(['circle', 'round', 'square'], {
    category: Category.Style
  }),
  href: Type.String({
    category:Category.General,
  }),
  target: Type.String({
    category:Category.General,
  }),
  disabled: Type.Boolean(),
  loading: Type.Boolean({
    category:Category.Style
  }),
  loadingFixedWidth: Type.Boolean({
    category:Category.Style,
    description:'The width of the button remains unchanged on loading'
  }),
  iconOnly: Type.Boolean({
    category:Category.Style
  }),
  long: Type.Boolean({
    category: Category.Style
  })
};
