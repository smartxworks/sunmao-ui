
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const ImagePropsSchema = {
  'src': Type.Optional(Type.String()),
  'title': Type.Optional(Type.String()),
  'description': Type.Optional(Type.String()),
  'footerPosition': Type.Optional(StringUnion(['inner', 'outer'])),
  'simple': Type.Optional(Type.Boolean()),
  'preview': Type.Optional(Type.Boolean())
};
