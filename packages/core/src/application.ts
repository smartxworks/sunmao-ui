import { Metadata } from './metadata';
import { parseVersion, Version } from './version';

// spec

export type Application = {
  version: string;
  kind: 'Application';
  metadata: Metadata;
  spec: {
    components: ComponentSchema[];
  };
};

export type ComponentSchema = {
  id: string;
  type: string;
  // do runtime type check
  properties: Record<string, unknown>;
  traits: TraitSchema[];
  // scopes TBD
};

export type TraitSchema = {
  type: string;
  // do runtime type check
  properties: Record<string, unknown>;
};

export type RuntimeTraitSchema = TraitSchema & {
  parsedType: VersionAndName;
}

type VersionAndName = {
  version: string;
  name: string;
};

export type RuntimeComponentSchema = Omit<ComponentSchema, 'traits'> & {
  parsedType: VersionAndName;
  traits: RuntimeTraitSchema[];
};

// extended runtime
export type RuntimeApplication = Omit<Application, 'spec'> & {
  parsedVersion: Version;
  spec: {
    components: RuntimeComponentSchema[];
  };
};

const TYPE_REG = /^([a-zA-Z0-9_\d]+\/[a-zA-Z0-9_\d]+)\/([a-zA-Z0-9_\d]+)$/;
function isValidType(v: string): boolean {
  return TYPE_REG.test(v);
}
export function parseType(v: string): VersionAndName {
  if (!isValidType(v)) {
    throw new Error(`Invalid type string: "${v}"`);
  }

  const [, version, name] = v.match(TYPE_REG) ?? [];
  return {
    version,
    name,
  };
}

export function isValidId(id: string): boolean {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(id);
}

export function createApplication(
  options: Omit<Application, 'kind'>
): RuntimeApplication {
  return {
    ...options,
    kind: 'Application',
    parsedVersion: parseVersion(options.version),
    spec: {
      ...options.spec,
      components: options.spec.components.map(c => {
        if (!isValidId(c.id)) {
          throw new Error(`Invalid id: "${c.id}"`);
        }
        return {
          ...c,
          parsedType: parseType(c.type),
          traits: c.traits.map(t => {
            return {
              ...t,
              parsedType: parseType(t.type),
            };
          }),
        };
      }),
    },
  };
}
