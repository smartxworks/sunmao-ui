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
};

// extended runtime
export type RuntimeModule = Module & {
  parsedVersion: Version;
};

export function createModule(options: Omit<Module, 'kind'>): RuntimeModule {
  return {
    ...options,
    kind: 'Module',
    parsedVersion: parseVersion(options.version),
  };
}
