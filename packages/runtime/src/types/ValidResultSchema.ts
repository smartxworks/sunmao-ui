import { Type } from '@sinclair/typebox';

export const ValidResultSchema = Type.Object({
  isInvalid: Type.Boolean(),
  errorMsg: Type.String(),
});
