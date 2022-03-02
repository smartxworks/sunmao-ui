
import { Type } from "@sinclair/typebox";
import { Category } from "../../constants/category";
import { StringUnion } from '../../sunmao-helper';

export const AvatarPropsSchema = {
  shape: StringUnion(['circle', 'square'], {
    title:'Shape',
    category: Category.Style
  }),
  size:Type.Number({
    title:'Size',
    category: Category.Style
  }),
  triggerType: StringUnion(['button', 'mask'],{
    title:'Trigger Type',
    category: Category.Basic,
    description:'Clickable avatar interaction type'
  })
};
