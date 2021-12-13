import { Type } from '@sinclair/typebox';

export const EventHandlerSchema = Type.Object(
  {
    type: Type.String(),
    componentId: Type.String(),
    method: Type.Object({
      name: Type.String(),
      parameters: Type.Optional(Type.Record(Type.String(), Type.Any())),
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
  },
  { description: 'eventHanlder' }
);

export const FetchTraitPropertiesSchema = Type.Object({
  url: Type.String(), // {format:uri}?;
  method: Type.String(), // {pattern: /^(get|post|put|delete)$/i}
  lazy: Type.Optional(Type.Boolean()),
  headers: Type.Record(Type.String(), Type.String()),
  body: Type.Record(Type.String(), Type.String()),
  onComplete: Type.Optional(Type.Array(EventHandlerSchema)),
});
