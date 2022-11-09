import { Static } from '@sinclair/typebox';
import { JSONSchema7 } from 'json-schema';
import {
  createComponent,
  CreateComponentOptions,
  createTrait,
  CreateTraitOptions,
  TraitSpec,
  createUtilMethod,
  CreateUtilMethodOptions,
  SlotSpec,
  MethodSchema,
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
  KStyle extends string,
  KEvent extends string,
  T extends CreateComponentOptions<
    T['spec']['properties'] extends JSONSchema7 ? T['spec']['properties'] : JSONSchema7,
    T['spec']['state'] extends JSONSchema7 ? T['spec']['state'] : JSONSchema7,
    T['spec']['methods'] extends Record<string, MethodSchema['parameters']>
      ? T['spec']['methods']
      : Record<string, MethodSchema['parameters']>,
    ToStringUnion<T['spec']['styleSlots']> extends KStyle
      ? ReadonlyArray<ToStringUnion<T['spec']['styleSlots']>>
      : ReadonlyArray<KStyle>,
    T['spec']['slots'] extends Record<string, SlotSpec>
      ? T['spec']['slots']
      : Record<string, SlotSpec>,
    ToStringUnion<T['spec']['events']> extends KEvent
      ? ReadonlyArray<ToStringUnion<T['spec']['events']>>
      : ReadonlyArray<KEvent>
  >
>(
  options: T
): (
  impl: ComponentImpl<
    Static<T['spec']['properties']> extends Record<string, unknown>
      ? Static<T['spec']['properties']>
      : Record<string, unknown>,
    Static<T['spec']['state']> extends Record<string, any>
      ? Static<T['spec']['state']>
      : Record<string, any>,
    ToMap<T['spec']['methods']>,
    T['spec']['slots'] extends Record<string, SlotSpec>
      ? T['spec']['slots']
      : Record<string, SlotSpec>,
    ToStringUnion<T['spec']['styleSlots']> extends KStyle
      ? ReadonlyArray<ToStringUnion<T['spec']['styleSlots']>>
      : ReadonlyArray<KStyle>,
    ToStringUnion<T['spec']['events']> extends KEvent
      ? ReadonlyArray<ToStringUnion<T['spec']['events']>>
      : ReadonlyArray<KEvent>
  >
) => ImplementedRuntimeComponent<
  T['spec']['properties'] extends JSONSchema7 ? T['spec']['properties'] : JSONSchema7,
  T['spec']['state'] extends JSONSchema7 ? T['spec']['state'] : JSONSchema7,
  T['spec']['methods'] extends Record<string, MethodSchema['parameters']>
    ? T['spec']['methods']
    : Record<string, MethodSchema['parameters']>,
  ToStringUnion<T['spec']['styleSlots']> extends KStyle
    ? ReadonlyArray<ToStringUnion<T['spec']['styleSlots']>>
    : ReadonlyArray<KStyle>,
  T['spec']['slots'] extends Record<string, SlotSpec>
    ? T['spec']['slots']
    : Record<string, SlotSpec>,
  ToStringUnion<T['spec']['events']> extends KEvent
    ? ReadonlyArray<ToStringUnion<T['spec']['events']>>
    : ReadonlyArray<KEvent>
> {
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
