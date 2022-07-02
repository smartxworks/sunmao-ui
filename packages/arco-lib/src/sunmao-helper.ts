// move to @sunmao-ui/runtime in the future?

import { ComponentMetadata } from '@sunmao-ui/core/lib/metadata';
import { ComponentImplProps } from '@sunmao-ui/runtime';
import { TLiteral, Type } from '@sinclair/typebox';
import { SlotSpec } from '@sunmao-ui/core';

export type IntoStringUnion<T> = {
  [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never;
};

export function StringUnion<T extends string[] | number[]>(
  values: [...T],
  options?: any
) {
  return Type.KeyOf(
    Type.Object(
      values.reduce((prev, cur) => {
        prev[cur] = Type.Boolean();
        return prev;
      }, {} as Record<T[number], any>)
    ),
    options
  );
}

export const FALLBACK_METADATA: ComponentMetadata = {
  name: '',
  description: '',
  displayName: '',
  exampleProperties: {},
};

export const getComponentProps = <
  T,
  TState,
  TMethods,
  TSlots extends Record<string, SlotSpec>,
  KStyleSlot extends string,
  KEvent extends string
>(
  props: T & ComponentImplProps<TState, TMethods, TSlots, KStyleSlot, KEvent>
) => {
  const {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    component,
    slotsElements,
    childrenMap,
    services,
    app,
    customStyle,
    callbackMap,
    mergeState,
    subscribeMethods,
    getElement,
    elementRef,
    hooks,
    isInModule,
    isInEditor,
    componentDidMount,
    componentDidUnmount,
    componentDidUpdate,
    /* eslint-enable @typescript-eslint/no-unused-vars */
    ...rest
  } = props;
  return rest;
};
