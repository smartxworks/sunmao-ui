import { EventHandlerSchema } from './TraitPropertiesSchema';
import { Type } from '@sinclair/typebox';
import { ComponentSchema, RuntimeModule } from '@sunmao-ui/core';

export const ModuleSchema = Type.Object({
  id: Type.String(),
  type: Type.String(),
  properties: Type.Record(Type.String(), Type.Any()),
  handlers: Type.Array(EventHandlerSchema),
});

export type ImplementedRuntimeModule = RuntimeModule & {
  impl: ComponentSchema[];
};
