import { Type } from '@sinclair/typebox';

export const ValidResultSpec = Type.Object({
  isInvalid: Type.Boolean(),
  errorMsg: Type.String(),
});
