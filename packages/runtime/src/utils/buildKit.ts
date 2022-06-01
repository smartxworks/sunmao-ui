import { Static } from '@sinclair/typebox';
import {
  createComponent,
  CreateComponentOptions,
  createTrait,
  CreateTraitOptions,
  TraitSpec,
  createUtilMethod,
  CreateUtilMethodOptions,
} from '@sunmao-ui/core';
import {
  ComponentImpl,
  ImplementedRuntimeComponent,
  TraitImplFactory,
  ImplementedRuntimeTraitFactory,
  UtilMethodImpl,
  ImplementedUtilMethod,
} from '../types';

type ToMap<U> = {
  [K in keyof U]: Static<U[K]>;
};

type ToStringUnion<T extends ReadonlyArray<string>> = T[number];

export function implementRuntimeComponent<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string,
  T extends CreateComponentOptions<KMethodName, KStyleSlot, KSlot, KEvent>
>(
  options: T
): (
  impl: ComponentImpl<
    Static<T['spec']['properties']>,
    Static<T['spec']['state']>,
    ToMap<T['spec']['methods']>,
    T['spec']['slots'],
    ToStringUnion<T['spec']['styleSlots']>,
    ToStringUnion<T['spec']['events']>
  >
) => ImplementedRuntimeComponent<KMethodName, KStyleSlot, KSlot, KEvent> {
  return impl => ({
    ...createComponent(options),
    impl,
  });
}

export function implementRuntimeTrait<T extends CreateTraitOptions>(
  options: T
): (
  factory: TraitImplFactory<
    Static<T['spec'] extends TraitSpec ? T['spec']['properties'] : undefined>
  >
) => ImplementedRuntimeTraitFactory {
  return factory => ({
    ...createTrait(options),
    factory,
  });
}

export function implementUtilMethod<T extends CreateUtilMethodOptions>(
  options: T
): (
  impl: UtilMethodImpl<Static<T['spec']['parameters']>>
) => ImplementedUtilMethod<Static<T['spec']['parameters']>> {
  return impl => ({
    ...createUtilMethod(options),
    impl,
  });
}
