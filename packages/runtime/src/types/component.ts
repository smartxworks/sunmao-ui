import { JSONSchema7 } from 'json-schema';
import { Static } from '@sinclair/typebox';
import {
  RuntimeApplication,
  RuntimeComponentSchema,
  RuntimeComponent,
  SlotSpec,
  MethodSchema,
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
  allComponents: RuntimeComponentSchema[];
  slotContext?: { renderSet: Set<string>; slotKey?: string };
} & ComponentParamsFromApp;

export type ComponentImplProps<
  TProps extends Record<string, unknown>,
  TState,
  TMethods,
  TSlots extends Record<string, SlotSpec>,
  KStyleSlots extends ReadonlyArray<string>,
  KEvents extends ReadonlyArray<string>
> = ImplWrapperProps<TProps, string> &
  TraitResult<KStyleSlots, KEvents>['props'] &
  RuntimeFunctions<TState, TMethods, TSlots> & {
    elementRef?: React.MutableRefObject<any>;
    getElement?: (ele: HTMLElement) => void;
  };

export type ComponentImpl<
  TProps extends Record<string, unknown> = Record<string, unknown>,
  TState = Record<string, any>,
  TMethods = Record<string, any>,
  TSlots extends Record<string, SlotSpec> = Record<string, any>,
  KStyleSlots extends ReadonlyArray<string> = ReadonlyArray<string>,
  KEvents extends ReadonlyArray<string> = ReadonlyArray<string>
> = React.FC<
  TProps & ComponentImplProps<TProps, TState, TMethods, TSlots, KStyleSlots, KEvents>
>;

export type ImplementedRuntimeComponent<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
> = RuntimeComponent<KProperties, KState, KMethods, KStyleSlots, KSlots, KEvents> & {
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
    fallback?: React.ReactNode,
    key?: string
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
