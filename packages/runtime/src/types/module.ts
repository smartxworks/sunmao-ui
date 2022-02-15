import { EventHandlerSchema } from './traitPropertiesSchema';
import { Type } from '@sinclair/typebox';
import { RuntimeModule } from '@sunmao-ui/core';

export const ModuleSchema = Type.Object({
  id: Type.String({
    title: 'ID',
    category: 'Basic',
  }),
  type: Type.String({
    title: 'Type',
    category: 'Basic',
  }),
  properties: Type.Record(Type.String(), Type.Any(), {
    title: 'Properties',
    category: 'Basic',
  }),
  handlers: Type.Array(EventHandlerSchema, {
    title: 'Handlers',
    category: 'Basic',
  }),
}, {
  category: 'Appearance',
});

export type ImplementedRuntimeModule = RuntimeModule;
