// move to @sunmao-ui/runtime in the future?

import { ComponentMetadata } from "@sunmao-ui/core/lib/metadata";
import { ComponentImplProps } from "@sunmao-ui/runtime";
import { TUnion, TLiteral, Type } from "@sinclair/typebox";

export type IntoStringUnion<T> = {
  [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never;
};

export function StringUnion<T extends string[]>(
  values: [...T]
): TUnion<IntoStringUnion<T>> {
  return Type.KeyOf(
    Type.Object(
      values.reduce((prev, cur) => {
        prev[cur] = Type.Boolean();
        return prev;
      }, {} as any)
    )
  ) as any;
}

export const FALLBACK_METADATA: ComponentMetadata = {
  name: "",
  description: "",
  displayName: "",
  isDraggable: true,
  isResizable: true,
  exampleProperties: {},
  exampleSize: [1, 1],
};

export const getComponentProps = <T, TState, TMethods, KSlot extends string,
  KStyleSlot extends string,
  KEvent extends string>(
    props: T & ComponentImplProps<TState, TMethods, KSlot, KStyleSlot, KEvent>
  ): T => {
  const {
    component,
    slotsElements,
    childrenMap,
    services,
    app,
    gridCallbacks,
    componentWrapper,
    data,
    customStyle,
    callbackMap,
    effects,
    mergeState,
    subscribeMethods,
    ...rest
  } = props;
  return (rest as unknown) as T;
};
