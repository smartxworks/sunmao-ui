import { EventHandlerSchema } from './traitPropertiesSchema';
import { Type } from '@sinclair/typebox';
import { RuntimeModule } from '@sunmao-ui/core';

export const ModuleSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  properties: Type.Record(Type.String(), Type.Any()),
  handlers: Type.Array(EventHandlerSchema),
});

export type ImplementedRuntimeModule = RuntimeModule;
