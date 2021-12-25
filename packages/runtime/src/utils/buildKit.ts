import { Static } from '@sinclair/typebox';
import {
  createComponent2,
  CreateComponentOptions2,
  RuntimeComponentSpec2,
} from '@sunmao-ui/core';
import { ComponentImplementation } from 'src/services/registry';

export type ImplementedRuntimeComponent2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = RuntimeComponentSpec2<KMethodName, KStyleSlot, KSlot, KEvent> & {
  impl: ComponentImplementation;
};

type ToMap<U> = {
  [K in keyof U]: Static<U[K]>;
};

type ToStringUnion<T extends ReadonlyArray<string>> = T[number];

export function implementRuntimeComponent2<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string,
  T extends CreateComponentOptions2<KMethodName, KStyleSlot, KSlot, KEvent>
>(
  options: T
): (
  impl: ComponentImplementation<
    Static<T['spec']['properties']>,
    Static<T['spec']['state']>,
    ToMap<T['spec']['methods']>,
    ToStringUnion<T['spec']['slots']>,
    ToStringUnion<T['spec']['styleSlots']>,
    ToStringUnion<T['spec']['events']>
  >
) => ImplementedRuntimeComponent2<KMethodName, KStyleSlot, KSlot, KEvent> {
  return impl => ({
    ...createComponent2(options),
    impl,
  });
}
