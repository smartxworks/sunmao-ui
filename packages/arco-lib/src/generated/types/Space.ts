
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

export const SpacePropsSchema = {
  'align': Type.Optional(StringUnion(['start', 'end', 'center', 'baseline'])),
  'direction': Type.Optional(StringUnion(['vertical', 'horizontal'])),
  'wrap': Type.Optional(Type.Boolean())
};
