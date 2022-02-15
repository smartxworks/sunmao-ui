
import { Type } from "@sinclair/typebox";
import { Category } from "src/constants/category";
import { StringUnion } from '../../sunmao-helper';

export const AvatarPropsSchema = {
  shape: StringUnion(['circle', 'square'], {
    category: Category.Style
  }),
  size:Type.Number({
    category: Category.Style
  }),
  autoFixFontSize: Type.Boolean({
    category: Category.Layout,
    description:'Whether to automatically adjust the font size according to the size of the avatar'
  }),
  triggerType: StringUnion(['button', 'mask'],{
    category: Category.General,
    description:'Clickable avatar interaction type'
  })
};
