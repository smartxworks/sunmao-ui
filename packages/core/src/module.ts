import { JSONSchema7Object } from 'json-schema';
import { parseVersion } from './version';
import { Metadata } from './metadata';
import { Version } from './version';
import { ApplicationComponent } from './application';

// spec

export type Module = {
  version: string;
  kind: 'Module';
  metadata: Metadata;
  spec: ModuleSpec;
};

type ModuleSpec = {
  components: ApplicationComponent[];
  properties: JSONSchema7Object;
  events: string[];
  stateMap: Record<string, string>;
};

// extended runtime
export type RuntimeModuleSpec = Module & {
  parsedVersion: Version;
};

export function createModule(options: Omit<Module, 'kind'>): RuntimeModuleSpec {
  return {
    ...options,
    kind: 'Module',
    parsedVersion: parseVersion(options.version),
  };
}
