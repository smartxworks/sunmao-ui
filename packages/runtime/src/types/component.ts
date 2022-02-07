import {
  RuntimeApplication,
  RuntimeComponentSchema,
  RuntimeComponent,
} from '@sunmao-ui/core';
import React from 'react';
import { UIServices, ComponentParamsFromApp } from './application';
import { TraitResult } from './trait';

// TODO: (type-safe), remove fallback type
export type ImplWrapperProps<KSlot extends string = string> = {
  component: RuntimeComponentSchema;
  childrenMap: ChildrenMap<KSlot>;
  services: UIServices;
  app?: RuntimeApplication;
} & ComponentParamsFromApp;

export type ComponentImplProps<
  TState,
  TMethods,
  KSlot extends string,
  KStyleSlot extends string,
  KEvent extends string
> = ImplWrapperProps<KSlot> &
  TraitResult<KStyleSlot, KEvent>['props'] &
  RuntimeFunctions<TState, TMethods> & {
    slotsElements: Record<KSlot, React.ReactElement[] | React.ReactElement>;
  };

export type ComponentImpl<
  TProps = any,
  TState = any,
  TMethods = Record<string, any>,
  KSlot extends string = string,
  KStyleSlot extends string = string,
  KEvent extends string = string
> = React.FC<TProps & ComponentImplProps<TState, TMethods, KSlot, KStyleSlot, KEvent>>;

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

export type RuntimeFunctions<TState, TMethods> = {
  mergeState: MergeState<TState>;
  subscribeMethods: SubscribeMethods<TMethods>;
};
