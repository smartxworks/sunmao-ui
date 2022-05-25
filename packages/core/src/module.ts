import { JSONSchema7Object } from 'json-schema';
import { parseVersion, Version } from './version';
import { Metadata } from './metadata';
import { ComponentSchema } from './application';

// spec

export type Module = {
  version: string;
  kind: 'Module';
  metadata: Metadata;
  spec: ModuleSpec;
  impl: ComponentSchema[];
};

type ModuleSpec = {
  properties: JSONSchema7Object;
  events: string[];
  stateMap: Record<string, string>;
  exampleProperties?: Record<string, string>;
};

// extended runtime
export type RuntimeModule = Module & {
  parsedVersion: Version;
};

// partial some fields, use as param createModule
type CreateModuleOptions = {
  version: string;
  metadata: Metadata;
  spec?: Partial<ModuleSpec>;
  impl?: ComponentSchema[];
};

export function createModule(options: CreateModuleOptions): RuntimeModule {
  return {
    version: options.version,
    kind: 'Module',
    parsedVersion: parseVersion(options.version),
    metadata: {
      name: options.metadata.name,
      description: options.metadata.description || '',
    },
    spec: {
      properties: {},
      events: [],
      stateMap: {},
      ...options.spec,
    },
    impl: options.impl || [],
  };
}
