import { Type } from '@sinclair/typebox';

export const BaseEventSpec = {
  componentId: Type.String({
    title: 'Component ID',
  }),
  method: Type.Object({
    name: Type.String({ title: 'Method Name' }),
    parameters: Type.Optional(Type.Record(Type.String(), Type.Any(), { title: 'Method Parameters' })),
  }, {
    title: 'Method',
  }),
  wait: Type.Optional(
    Type.Object({
      type: Type.KeyOf(
        Type.Object({
          debounce: Type.String(),
          throttle: Type.String(),
          delay: Type.String(),
        }),
        { title: 'Wait Type' },
      ),
      time: Type.Number({ title: 'Time' }),
    }, {
      title: 'Wait',
    })
  ),
  disabled: Type.Optional(Type.Boolean({ title: 'Disabled' })),
};

export const EventHandlerSpec = Type.Object({
  type: Type.String(),
  ...BaseEventSpec,
}, {
  widget: 'core/v1/event'
});

export const EventCallBackHandlerSpec = Type.Object(BaseEventSpec);

export const FetchTraitPropertiesSpec = Type.Object({
  url: Type.String({ title: 'URL' }), // {format:uri}?;
  method: Type.KeyOf(
    Type.Object({
      get: Type.String(),
      post: Type.String(),
      put: Type.String(),
      delete: Type.String(),
      patch: Type.String(),
    }), 
    { title: 'Method' },
  ), // {pattern: /^(get|post|put|delete)$/i}
  lazy: Type.Boolean({ title: 'Lazy' }),
  disabled: Type.Boolean({ title: 'Disabled' }),
  headers: Type.Record(Type.String(), Type.String(), {
    title: 'Headers',
  }),
  body: Type.Record(Type.String(), Type.String(), {
    title: 'Body',
    widget: "core/v1/record",
  }),
  bodyType: Type.KeyOf(
    Type.Object({
      json: Type.String(),
      formData: Type.String(),
    }),
    { title: 'Body Type' },
  ),
  onComplete: Type.Array(EventCallBackHandlerSpec),
  onError: Type.Array(EventCallBackHandlerSpec),
});
