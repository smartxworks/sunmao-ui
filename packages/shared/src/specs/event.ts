import { Type } from '@sinclair/typebox';
import { CORE_VERSION, EVENT_WIDGET_NAME } from '../constants/core';

const BaseEventSpecObject = {
  componentId: Type.String({
    title: 'Component ID',
  }),
  method: Type.Object(
    {
      name: Type.String({ title: 'Method Name' }),
      parameters: Type.Optional(
        Type.Record(Type.String(), Type.Any(), { title: 'Method Parameters' })
      ),
    },
    {
      title: 'Method',
    }
  ),
  wait: Type.Optional(
    Type.Object(
      {
        type: Type.KeyOf(
          Type.Object({
            debounce: Type.String(),
            throttle: Type.String(),
            delay: Type.String(),
          }),
          { title: 'Wait Type' }
        ),
        time: Type.Number({ title: 'Time' }),
      },
      {
        title: 'Wait',
      }
    )
  ),
  disabled: Type.Optional(Type.Boolean({ title: 'Disabled' })),
};

export const EventHandlerSpec = Type.Object(
  {
    type: Type.String(),
    ...BaseEventSpecObject,
  },
  {
    widget: `${CORE_VERSION}/${EVENT_WIDGET_NAME}`,
  }
);

export const EventCallBackHandlerSpec = Type.Object(BaseEventSpecObject, {
  widget: `${CORE_VERSION}/${EVENT_WIDGET_NAME}`,
});
