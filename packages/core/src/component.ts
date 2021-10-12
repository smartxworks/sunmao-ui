import { JSONSchema7, JSONSchema7Object } from 'json-schema';
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
  properties: JSONSchema7Object;
  acceptTraits: TraitSchema[];
  state: JSONSchema7;
  methods: MethodSchema[];
};

type TraitSchema = {
  name: string;
};

// extended runtime
export type RuntimeComponent = Component & {
  parsedVersion: Version;
};

export function createComponent(options: Omit<Component, 'kind'>): RuntimeComponent {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
