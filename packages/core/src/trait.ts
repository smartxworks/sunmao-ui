import { JSONSchema7, JSONSchema7Object } from 'json-schema';
import { Metadata } from './metadata';
import { MethodSchema } from './method';
import { parseVersion, Version } from './version';

// spec

type TraitMetaData = Metadata<{ hasUnmount: boolean }>;

export type Trait = {
  version: string;
  kind: 'Trait';
  metadata: TraitMetaData;
  spec: TraitSpec;
};

type TraitSpec = {
  properties: JSONSchema7Object;
  state: JSONSchema7;
  methods: MethodSchema[];
};

// extended runtime
export type RuntimeTrait = Trait & {
  parsedVersion: Version;
};

// partial some fields, use as param createModule
type CreateTraitOptions = {
  version: string;
  metadata: TraitMetaData;
  spec?: Partial<TraitSpec>;
};

// partial some field
export function createTrait(options: CreateTraitOptions): RuntimeTrait {
  return {
    version: options.version,
    kind: 'Trait' as any,
    parsedVersion: parseVersion(options.version),
    metadata: {
      name: options.metadata.name,
      description: options.metadata.description || '',
      annotations: options.metadata.annotations,
    },
    spec: {
      properties: {},
      state: {},
      methods: [],
      ...options.spec,
    },
  };
}
