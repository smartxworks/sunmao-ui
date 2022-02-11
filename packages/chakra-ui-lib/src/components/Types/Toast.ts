import { Type, Static, TProperties, TObject } from '@sinclair/typebox';
import { createStandaloneToast } from '@chakra-ui/react';
import { UtilMethod } from '@sunmao-ui/runtime';

const ToastPosition = Type.Union([
  Type.Literal('top'),
  Type.Literal('top-right'),
  Type.Literal('top-left'),
  Type.Literal('bottom'),
  Type.Literal('bottom-right'),
  Type.Literal('bottom-left'),
]);
export const ToastOpenParameterSchema = Type.Object({
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

export type ToastOpenParameter = Static<typeof ToastOpenParameterSchema>;
export type ToastCloseParameter = Static<typeof ToastCloseParameterSchema>;

const pickProperty = <T, U extends Record<string, any>>(
  schema: TObject<T>,
  object: U
): Partial<Static<TObject<T>>> => {
  const result: Partial<TProperties> = {};
  for (const key in schema.properties) {
    result[key] = object[key];
  }
  return result as Partial<Static<TObject<T>>>;
};

export default function ToastUtilMethodFactory() {
  let toast: ReturnType<typeof createStandaloneToast> | undefined;
  const toastOpen: UtilMethod = {
    name: 'toast.open',
    method(parameters: Static<typeof ToastOpenParameterSchema>) {
      if (!toast) {
        toast = createStandaloneToast();
      }
      if (parameters) {
        toast(pickProperty(ToastOpenParameterSchema, parameters));
      }
    },
    parameters: ToastOpenParameterSchema,
  };

  const toastClose: UtilMethod = {
    name: 'toast.close',
    method(parameters: Static<typeof ToastCloseParameterSchema>) {
      if (!toast) {
        return;
      }
      if (!parameters) {
        toast.closeAll();
      } else {
        const closeParameters = pickProperty(ToastCloseParameterSchema, parameters);
        if (closeParameters.id !== undefined) {
          toast.close(closeParameters.id);
        } else {
          toast.closeAll(closeParameters);
        }
      }
    },
    parameters: ToastCloseParameterSchema,
  };
  return [toastOpen, toastClose];
}
