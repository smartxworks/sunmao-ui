
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const StepItemSchema = Type.Object({
  title: Type.String(),
  description: Type.String()
})

export const StepsPropsSchema = {
  type: StringUnion(['default', 'arrow', 'dot', 'navigation']),
  current:Type.Number(),
  size: StringUnion(['default', 'small']),
  direction: StringUnion(['vertical', 'horizontal']),
  labelPlacement: StringUnion(['vertical', 'horizontal']),
  status: StringUnion(['wait', 'process', 'finish', 'error']),
  lineless: Type.Boolean(),
  items: Type.Array(StepItemSchema)
};
