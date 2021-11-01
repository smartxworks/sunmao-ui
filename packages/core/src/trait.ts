import { JSONSchema7, JSONSchema7Object } from 'json-schema';
import { Metadata } from './metadata';
import { MethodSchema } from './method';
import { parseVersion, Version } from './version';

// spec

export type Trait = {
  version: string;
  kind: 'Trait';
  metadata: Metadata;
  spec: TraitSpec;
};

type TraitSpec = {
  properties: JSONSchema7Object;
  state: JSONSchema7;
  methods: MethodSchema[];
};

// extended runtime
export type RuntimeTraitSpec = Trait & {
  parsedVersion: Version;
};

export function createTrait(options: Omit<Trait, 'kind'>): RuntimeTraitSpec {
  return {
    ...options,
    kind: 'Trait',
    parsedVersion: parseVersion(options.version),
  };
}
