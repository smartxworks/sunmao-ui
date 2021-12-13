import { JSONSchema7Object } from 'json-schema';
import { parseVersion } from './version';
import { Metadata } from './metadata';
import { Version } from './version';

// spec

export type Module = {
  version: string;
  kind: 'Module';
  metadata: Metadata;
  spec: ModuleSpec;
};

type ModuleSpec = {
  properties: JSONSchema7Object;
  events: string[];
  stateMap: Record<string, string>;
};

// extended runtime
export type RuntimeModuleSpec = Module & {
  parsedVersion: Version;
};

// partial some fields, use as param createModule
export type ModuleDefinition = {
  version: string;
  metadata: Metadata;
  spec?: Partial<ModuleSpec>;
};

export function createModule(options: ModuleDefinition): RuntimeModuleSpec {
  return {
    version: options.version,
    kind: 'Module',
    parsedVersion: parseVersion(options.version),
    metadata: {
      name: options.metadata.name,
      description: options.metadata.description,
    },
    spec: {
      properties: {},
      events: [],
      stateMap: {},
      ...options.spec
    },
  };
}
