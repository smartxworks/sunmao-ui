import { JSONSchema7 } from 'json-schema';
import { parseVersion } from './version';
import { ComponentMetadata } from './metadata';
import { MethodSchema } from './method';
import { Version } from './version';

// spec

export type Component = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata;
  spec: ComponentSpec;
};

type ComponentSpec = {
  properties: JSONSchema7;
  state: JSONSchema7;
  methods: MethodSchema[];
  styleSlots: string[];
  slots: string[];
  events: string[];
};

type ComponentSpec2<TMethodName extends string, K1, K2, K3> = Readonly<{
  properties: JSONSchema7;
  state: JSONSchema7;
  methods: Record<TMethodName, MethodSchema['parameters']>;
  styleSlots: ReadonlyArray<K1>;
  slots: ReadonlyArray<K2>;
  events: ReadonlyArray<K3>;
}>;

export type Component2<TMethodName extends string, K1, K2, K3> = {
  version: string;
  kind: 'Component';
  metadata: ComponentMetadata;
  spec: ComponentSpec2<TMethodName, K1, K2, K3>;
};

export type RuntimeComponentSpec2<TMethodName extends string, K1, K2, K3> = Component2<
  TMethodName,
  K1,
  K2,
  K3
> & {
  parsedVersion: Version;
};

// extended runtime
export type RuntimeComponentSpec = Component & {
  parsedVersion: Version;
};

export function createComponent(options: Omit<Component, 'kind'>): RuntimeComponentSpec {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}

export type CreateComponentOptions2<TMethodName extends string, K1, K2, K3> = Omit<
  Component2<TMethodName, K1, K2, K3>,
  'kind'
>;

export function createComponent2<TMethodName extends string, K1, K2, K3>(
  options: CreateComponentOptions2<TMethodName, K1, K2, K3>
): RuntimeComponentSpec2<TMethodName, K1, K2, K3> {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
