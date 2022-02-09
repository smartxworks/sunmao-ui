
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const SpacePropsSchema = {
  'align': StringUnion(['start', 'end', 'center', 'baseline']),
  'direction': StringUnion(['vertical', 'horizontal']),
  'wrap': Type.Boolean()
};
