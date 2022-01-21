
import { Type } from "@sinclair/typebox";
import { StringUnion } from '../../sunmao-helper';

export const StepItemSchema = Type.Object({
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String())
})

export const StepsPropsSchema = {
  className: Type.Optional(Type.String()),
  type: Type.Optional(StringUnion(['default', 'arrow', 'dot', 'navigation'])),
  current:Type.Number(),
  size: Type.Optional(StringUnion(['default', 'small'])),
  direction: Type.Optional(StringUnion(['vertical', 'horizontal'])),
  labelPlacement: Type.Optional(StringUnion(['vertical', 'horizontal'])),
  status: Type.Optional(StringUnion(['wait', 'process', 'finish', 'error'])),
  lineless: Type.Optional(Type.Boolean()),
  items: Type.Optional(Type.Array(StepItemSchema))
};
