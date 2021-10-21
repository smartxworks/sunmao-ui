import { Type } from '@sinclair/typebox';

export const EventHandlerSchema = Type.Object({
  type: Type.String(),
  componentId: Type.String(),
  method: Type.Object({
    name: Type.String(),
    parameters: Type.Any(),
  }),
  wait: Type.Optional(
    Type.Object({
      type: Type.KeyOf(
        Type.Object({
          debounce: Type.String(),
          throttle: Type.String(),
          delay: Type.String(),
        })
      ),
      time: Type.Number(),
    })
  ),
  disabled: Type.Optional(Type.Boolean()),
});
