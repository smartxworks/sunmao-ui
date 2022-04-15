import { EventHandlerSpec } from './traitPropertiesSpec';
import { Type } from '@sinclair/typebox';
import { RuntimeModule } from '@sunmao-ui/core';

export const ModuleSpec = Type.Object({
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
    widget: 'core/v1/KeyValue',
  }),
  handlers: Type.Array(EventHandlerSpec, {
    title: 'Module Handlers',
    category: 'Basic',
  }),
}, {
  category: 'Basic',
});

export type ImplementedRuntimeModule = RuntimeModule;
