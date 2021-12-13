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

// partial some fields, use as param createTrait
export type TraitDefinition = {
  version: string;
  metadata: Metadata;
  spec?: Partial<TraitSpec>;
};

export function createTrait(options: TraitDefinition): RuntimeTraitSpec {
  return (
    {
      version: options.version,
      kind: ('Trait' as any),
      parsedVersion: parseVersion(options.version),
      metadata: {
        name: options.metadata.name,
        description: options.metadata.description,
      },
      spec: {
        properties: {},
        state: {},
        methods: [],
        ...options.spec
      },
    }
  );
}
