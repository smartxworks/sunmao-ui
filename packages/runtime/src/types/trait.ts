import { RuntimeTrait, RuntimeTraitSchema } from '@sunmao-ui/core';
import { UIServices } from './application';
import { RuntimeFunctions } from './component';

type ToStringUnion<T extends ReadonlyArray<string>> = T[number];

export type TraitResult<
  KStyleSlots extends ReadonlyArray<string>,
  KEvents extends ReadonlyArray<string>
> = {
  props: {
    data?: unknown;
    customStyle?: Record<ToStringUnion<KStyleSlots>, string>;
    callbackMap?: CallbackMap<ToStringUnion<KEvents>>;
    componentDidUnmount?: Array<() => void>;
    componentDidMount?: Array<() => Function | void>;
    componentDidUpdate?: Array<() => Function | void>;
    traitPropertiesDidUpdated?: Array<() => Function | void>;
  } | null;
  unmount?: boolean;
};

export type TraitImpl<TProperties = any> = (
  props: TProperties &
    RuntimeFunctions<unknown, unknown, any> & {
      trait: RuntimeTraitSchema<TProperties>;
      componentId: string;
      services: UIServices;
      slotKey: string;
    }
) => TraitResult<ReadonlyArray<string>, ReadonlyArray<string>>;

export type TraitImplFactory<T = any> = () => TraitImpl<T>;

export type ImplementedRuntimeTraitFactory = RuntimeTrait & {
  factory: TraitImplFactory;
};

export type ImplementedRuntimeTrait = ImplementedRuntimeTraitFactory & {
  impl: TraitImpl;
};

export type CallbackMap<K extends string> = Record<K, () => void>;
