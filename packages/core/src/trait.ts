import { JSONSchema7 } from 'json-schema';
import { Metadata } from './metadata';
import { MethodSchema } from './method';
import { parseVersion, Version } from './version';

// spec

type TraitMetaData = Metadata<{ beforeRender?: boolean }>;

export type Trait = {
  version: string;
  kind: 'Trait';
  metadata: TraitMetaData;
  spec: TraitSpec;
};

export type TraitSpec = {
  properties: JSONSchema7;
  state: JSONSchema7;
  methods: MethodSchema[];
};

// extended runtime
export type RuntimeTrait = Trait & {
  parsedVersion: Version;
};

// partial some fields, use as param createModule
export type CreateTraitOptions = {
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
      ...options.metadata,
      description: options.metadata.description || '',
      annotations: options.metadata.annotations || {},
    },
    spec: {
      properties: {},
      state: {},
      methods: [],
      ...options.spec,
    },
  };
}
