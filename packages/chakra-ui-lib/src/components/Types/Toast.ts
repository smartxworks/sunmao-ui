import { Type, Static, TProperties, TObject } from '@sinclair/typebox';
import { createStandaloneToast } from '@chakra-ui/react';
import { implementUtilMethod } from '@sunmao-ui/runtime';

const ToastPosition = Type.KeyOf(
  Type.Object({
    top: Type.String(),
    'top-right': Type.String(),
    'top-left': Type.String(),
    bottom: Type.String(),
    'bottom-right': Type.String(),
    'bottom-left': Type.String(),
  }),
  {
    defaultValue: 'top',
  }
);
export const ToastOpenParameterSpec = Type.Object({
  position: ToastPosition,
  duration: Type.Number({ defaultValue: 1000 }),
  title: Type.String(),
  description: Type.String(),
  isClosable: Type.Boolean(),
  variant: Type.KeyOf(
    Type.Object({
      subtle: Type.String(),
      solid: Type.String(),
      'left-accent': Type.String(),
      'top-accent': Type.String(),
    }),
    {
      defaultValue: 'subtle',
    }
  ),
  status: Type.KeyOf(
    Type.Object({
      error: Type.String(),
      success: Type.String(),
      warning: Type.String(),
      info: Type.String(),
    }),
    {
      defaultValue: 'info',
    }
  ),
  id: Type.String(),
});

export const ToastCloseParameterSpec = Type.Object({
  id: Type.String(),
  positions: Type.Array(ToastPosition, {
    defaultValue: [],
  }),
});

export type ToastOpenParameter = Static<typeof ToastOpenParameterSpec>;
export type ToastCloseParameter = Static<typeof ToastCloseParameterSpec>;

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

  const toastOpen = implementUtilMethod({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'openToast',
    },
    spec: {
      parameters: ToastOpenParameterSpec,
    },
  })(parameters => {
    if (!toast) {
      toast = createStandaloneToast();
    }
    if (parameters) {
      toast(pickProperty(ToastOpenParameterSpec, parameters));
    }
  });

  const toastClose = implementUtilMethod({
    version: 'chakra_ui/v1',
    metadata: {
      name: 'closeToast',
    },
    spec: {
      parameters: ToastCloseParameterSpec,
    },
  })(parameters => {
    if (!toast) {
      return;
    }
    if (!parameters) {
      toast.closeAll();
    } else {
      const closeParameters = pickProperty(ToastCloseParameterSpec, parameters);
      if (closeParameters.id !== undefined) {
        toast.close(closeParameters.id);
      } else {
        toast.closeAll(closeParameters);
      }
    }
  });

  return [toastOpen, toastClose];
}
