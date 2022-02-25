import { RuntimeTrait, RuntimeTraitSchema } from '@sunmao-ui/core';
import { UIServices } from './application';
import { RuntimeFunctions } from './component';

export type TraitResult<KStyleSlot extends string, KEvent extends string> = {
  props: {
    data?: unknown;
    customStyle?: Record<KStyleSlot, string>;
    callbackMap?: CallbackMap<KEvent>;
    effects?: Array<() => void>;
  } | null;
  unmount?: boolean;
};

export type TraitImpl<T = any> = (
  props: T &
    RuntimeFunctions<unknown, unknown> & {
      trait: RuntimeTraitSchema;
      componentId: string;
      services: UIServices;
    }
) => TraitResult<string, string>;

export type ImplementedRuntimeTrait = RuntimeTrait & {
  impl: TraitImpl;
};

export type CallbackMap<K extends string> = Record<K, () => void>;
