
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const ImagePropsSchema = {
  'src': Type.String(),
  'title': Type.String(),
  'description': Type.String(),
  'footerPosition': StringUnion(['inner', 'outer']),
  'simple': Type.Boolean(),
  'preview': Type.Boolean()
};
