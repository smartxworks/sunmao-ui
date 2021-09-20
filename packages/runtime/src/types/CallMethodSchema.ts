import { Type } from '@sinclair/typebox';

export const CallMethodSchema = Type.Object({
  componentId: Type.String(),
  method: Type.Object({
    name: Type.String(),
    parameters: Type.Any(),
  }),
});
