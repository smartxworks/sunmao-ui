import { JSONSchema7 } from 'json-schema';
import type { Static } from '@sinclair/typebox';
import { parseVersion, Version } from './version';
import { ComponentMetadata } from './metadata';
import { MethodSchema } from './method';
import { SlotSpec } from './slot';

type DeepPartial<T> = T extends Record<string, any> | Record<string, any>[]
  ? Partial<{
      [K in keyof T]: DeepPartial<T[K]>;
    }>
  : T;

type ComponentSpec<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
> = {
  properties: KProperties;
  state: KState;
  methods: KMethods;
  styleSlots: KStyleSlots;
  slots: KSlots;
  events: KEvents;
};

export type Component<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
> = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata<DeepPartial<Static<KProperties>>>;
  spec: ComponentSpec<KProperties, KState, KMethods, KStyleSlots, KSlots, KEvents>;
};

export type RuntimeComponent<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
> = Component<KProperties, KState, KMethods, KStyleSlots, KSlots, KEvents> & {
  parsedVersion: Version;
};

export type CreateComponentOptions<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
> = Omit<Component<KProperties, KState, KMethods, KStyleSlots, KSlots, KEvents>, 'kind'>;

export function createComponent<
  KProperties extends JSONSchema7,
  KState extends JSONSchema7,
  KMethods extends Record<string, MethodSchema['parameters']>,
  KStyleSlots extends ReadonlyArray<string>,
  KSlots extends Record<string, SlotSpec>,
  KEvents extends ReadonlyArray<string>
>(
  options: CreateComponentOptions<
    KProperties,
    KState,
    KMethods,
    KStyleSlots,
    KSlots,
    KEvents
  >
): RuntimeComponent<KProperties, KState, KMethods, KStyleSlots, KSlots, KEvents> {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
