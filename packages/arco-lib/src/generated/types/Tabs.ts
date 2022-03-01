
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';
import { PRESET_PROPERTY_CATEGORY } from '@sunmao-ui/editor'

export const TabsPropsSchema = {
  tabNames:Type.Array(
  Type.String(),{
    title:'Tab Names',
  }),
  defaultActiveTab: Type.String({
    title: 'Default Active Tab',
    category:PRESET_PROPERTY_CATEGORY.Basic
  }),
  tabPosition: StringUnion(['left', 'right', 'top', 'bottom'],{
    title:'Tab Position',
    category:PRESET_PROPERTY_CATEGORY.Layout
  }),
  size: StringUnion(['mini', 'small', 'default', 'large'],{
    title:'Size',
    category:PRESET_PROPERTY_CATEGORY.Style
  }),
  type: StringUnion(['line', 'card', 'card-gutter', 'text', 'rounded', 'capsule'],{
    title:'Type',
    category:PRESET_PROPERTY_CATEGORY.Style
  }),
};
