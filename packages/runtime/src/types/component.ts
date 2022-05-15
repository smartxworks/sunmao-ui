import { Static } from '@sinclair/typebox';
import {
  RuntimeApplication,
  RuntimeComponentSchema,
  RuntimeComponent,
  SlotSchema,
} from '@sunmao-ui/core';
import React from 'react';
import { UIServices, ComponentParamsFromApp } from './application';
import { TraitResult } from './trait';

// TODO: (type-safe), remove fallback type
export type ImplWrapperProps<KSlot extends string = string> = {
  component: RuntimeComponentSchema;
  childrenMap: ChildrenMap<KSlot>;
  services: UIServices;
  isInModule: boolean;
  app?: RuntimeApplication;
  slotProps?: unknown;
} & ComponentParamsFromApp;

export type ComponentImplProps<
  TState,
  TMethods,
  TSlots extends Record<string, SlotSchema>,
  KStyleSlot extends string,
  KEvent extends string
> = ImplWrapperProps &
  TraitResult<KStyleSlot, KEvent>['props'] &
  RuntimeFunctions<TState, TMethods, TSlots> & {
    elementRef?: React.Ref<any>;
    getElement?: (ele: HTMLElement) => void;
  };

export type ComponentImpl<
  TProps = any,
  TState = any,
  TMethods = Record<string, any>,
  TSlots extends Record<string, SlotSchema> = Record<string, any>,
  KStyleSlot extends string = string,
  KEvent extends string = string
> = React.FC<TProps & ComponentImplProps<TState, TMethods, TSlots, KStyleSlot, KEvent>>;

export type ImplementedRuntimeComponent<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = RuntimeComponent<KMethodName, KStyleSlot, KSlot, KEvent> & {
  impl: ComponentImpl;
};

export type ChildrenMap<KSlot extends string> = Record<
  string,
  Record<KSlot, RuntimeComponentSchema[]> & {
    _grandChildren?: RuntimeComponentSchema[];
    _allChildren: RuntimeComponentSchema[];
  }
>;

type SubscribeMethods<U> = (map: {
  [K in keyof U]: (parameters: U[K]) => void;
}) => void;
type MergeState<T> = (partialState: Partial<T>) => void;
export type SlotsElements<U extends Record<string, SlotSchema>> = {
  [K in keyof U]?: (props: Static<U[K]['slotProps']>) => React.ReactNode;
};

export type RuntimeFunctions<
  TState,
  TMethods,
  TSlots extends Record<string, SlotSchema>
> = {
  mergeState: MergeState<TState>;
  subscribeMethods: SubscribeMethods<TMethods>;
  slotsElements: SlotsElements<TSlots>;
};
