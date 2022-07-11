import { JSONSchema7 } from 'json-schema';
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
  properties: JSONSchema7;
  events: string[];
  stateMap: Record<string, string>;
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
      exampleProperties: options.metadata.exampleProperties || {},
    },
    spec: {
      // `json-schema-editor` has a readonly root object by default,
      // it provides two schema formats,array({type:'array'}) and object({type:'object'}).
      // In sunmao, we only use the object schema, so we need to specify a default value here
      // and silently fail when root selects array.
      // This is a bit obscure, so should remove the array type of root from the json-schema-editor later
      // TODO remove the array type of root from the json-schema-editor
      properties: { type: 'object' },
      events: [],
      stateMap: {},
      ...options.spec,
    },
    impl: options.impl || [],
  };
}
