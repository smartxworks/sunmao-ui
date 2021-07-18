import { Metadata } from "./metadata";
import { parseVersion, Version } from "./version";

// spec

export type Application = {
  version: string;
  kind: "Application";
  metadata: Metadata;
  spec: ApplicationSpec;
};

type ApplicationSpec = {
  components: ApplicationComponent[];
};

type ApplicationComponent = {
  id: string;
  type: string;
  // do runtime type check
  properties: object;
  traits: ComponentTrait[];
  // scopes TBD
};

type ComponentTrait = {
  type: string;
  // do runtime type check
  properties: object;
};

type VersionAndName = {
  version: string;
  name: string;
};

// extended runtime
export type RuntimeApplication = Omit<Application, "spec"> & {
  parsedVersion: Version;
  spec: Omit<ApplicationSpec, "components"> & {
    components: Array<
      Omit<ApplicationComponent, "traits"> & {
        parsedType: VersionAndName;
        traits: Array<
          ComponentTrait & {
            parsedType: VersionAndName;
          }
        >;
      }
    >;
  };
};

const TYPE_REG = /^([a-zA-Z0-9_\d]+\/[a-zA-Z0-9_\d]+)\/([a-zA-Z0-9_\d]+)$/;
function isValidType(v: string): boolean {
  return TYPE_REG.test(v);
}
function parseType(v: string): VersionAndName {
  if (!isValidType(v)) {
    throw new Error(`Invalid type string: "${v}"`);
  }

  const [, version, name] = v.match(TYPE_REG)!;
  return {
    version,
    name,
  };
}

export function createApplication(
  options: Omit<Application, "kind">
): RuntimeApplication {
  return {
    ...options,
    kind: "Application",
    parsedVersion: parseVersion(options.version),
    spec: {
      ...options.spec,
      components: options.spec.components.map((c) => {
        return {
          ...c,
          parsedType: parseType(c.type),
          traits: c.traits.map((t) => {
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
