import { JSONSchema7 } from 'json-schema';
import { parseVersion } from './version';
import { Metadata } from './metadata';
import { MethodSchema } from './method';
import { Version } from './version';

// spec

export type Component = {
  version: string;
  kind: 'Component';
  metadata: Metadata;
  spec: ComponentSpec;
};

type ComponentSpec = {
  properties: Array<JSONSchema7 & { name: string }>;
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

export function createComponent(
  options: Omit<Component, 'kind'>
): RuntimeComponent {
  return {
    ...options,
    kind: 'Component',
    parsedVersion: parseVersion(options.version),
  };
}
