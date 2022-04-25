import { EventHandlerSpec } from './event';
import { Type } from '@sinclair/typebox';
import { CORE_VERSION, RECORD_FIELD_WIDGET_NAME } from '../constants/core';

export const ModuleSpec = Type.Object(
  {
    id: Type.String({
      title: 'Module ID',
      category: 'Basic',
    }),
    type: Type.String({
      title: 'Module Type',
      category: 'Basic',
    }),
    properties: Type.Record(Type.String(), Type.Any(), {
      title: 'Module Properties',
      category: 'Basic',
      widget: `${CORE_VERSION}/${RECORD_FIELD_WIDGET_NAME}`,
    }),
    handlers: Type.Array(EventHandlerSpec, {
      title: 'Module Handlers',
      category: 'Basic',
    }),
  },
  {
    category: 'Basic',
  }
);
