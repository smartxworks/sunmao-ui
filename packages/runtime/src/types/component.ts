import { Static } from '@sinclair/typebox';
import {
  RuntimeApplication,
  RuntimeComponentSchema,
  RuntimeComponent,
  SlotSpec,
} from '@sunmao-ui/core';
import React from 'react';
import { UIServices, ComponentParamsFromApp } from './application';
import { TraitResult } from './trait';

// TODO: (type-safe), remove fallback type
export type ImplWrapperProps<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  KSlot extends string = string
> = {
  component: RuntimeComponentSchema<TProps>;
  childrenMap: ChildrenMap<KSlot>;
  services: UIServices;
  isInModule: boolean;
  app: RuntimeApplication;
  evalListItem?: boolean;
  slotProps?: unknown;
  slotFallback?: React.ReactNode;
} & ComponentParamsFromApp;

export type ComponentImplProps<
  TProps extends Record<string, unknown>,
  TState,
  TMethods,
  TSlots extends Record<string, SlotSpec>,
  KStyleSlot extends string,
  KEvent extends string
> = ImplWrapperProps<TProps, string> &
  TraitResult<KStyleSlot, KEvent>['props'] &
  RuntimeFunctions<TState, TMethods, TSlots> & {
    elementRef?: React.MutableRefObject<any>;
    getElement?: (ele: HTMLElement) => void;
  };

export type ComponentImpl<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TState = any,
  TMethods = Record<string, any>,
  TSlots extends Record<string, SlotSpec> = Record<string, any>,
  KStyleSlot extends string = string,
  KEvent extends string = string
> = React.FC<
  TProps & ComponentImplProps<TProps, TState, TMethods, TSlots, KStyleSlot, KEvent>
>;

export type ImplementedRuntimeComponent<
  KMethodName extends string,
  KStyleSlot extends string,
  KSlot extends string,
  KEvent extends string
> = RuntimeComponent<KMethodName, KStyleSlot, KSlot, KEvent> & {
  impl: ComponentImpl<any>;
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
export type SlotsElements<U extends Record<string, SlotSpec>> = {
  [K in keyof U]?: (
    props: Static<U[K]['slotProps']>,
    fallback?: React.ReactNode
  ) => React.ReactNode;
};

export type RuntimeFunctions<
  TState,
  TMethods,
  TSlots extends Record<string, SlotSpec>
> = {
  mergeState: MergeState<TState>;
  subscribeMethods: SubscribeMethods<TMethods>;
  slotsElements: SlotsElements<TSlots>;
};
