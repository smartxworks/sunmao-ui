import { Type, Static } from '@sinclair/typebox';
const ToastPosition = Type.Union([
  Type.Literal('top'),
  Type.Literal('top-right'),
  Type.Literal('top-left'),
  Type.Literal('bottom'),
  Type.Literal('bottom-right'),
  Type.Literal('bottom-left'),
]);
export const ToastOpenParamterSchema = Type.Object({
  position: Type.Optional(ToastPosition),
  duration: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  isClosable: Type.Optional(Type.Boolean()),
  variant: Type.Optional(
    Type.Union([
      Type.Literal('subtle'),
      Type.Literal('solid'),
      Type.Literal('left-accent'),
      Type.Literal('top-accent'),
    ])
  ),
  status: Type.Optional(
    Type.Union([
      Type.Literal('error'),
      Type.Literal('success'),
      Type.Literal('warning'),
      Type.Literal('info'),
    ])
  ),
  id: Type.Optional(Type.String()),
});

export const ToastCloseParameterSchema = Type.Object({
  id: Type.Optional(Type.Union([Type.Number(), Type.String()])),
  positions: Type.Optional(Type.Array(ToastPosition)),
});

export type ToastOpenParameter = Static<typeof ToastOpenParamterSchema>;
export type ToastCloseParameter = Static<typeof ToastCloseParameterSchema>;