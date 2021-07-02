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

// extended runtime
export type RuntimeApplication = Application & {
  parsedVersion: Version;
};

export function createApplication(
  options: Omit<Application, "kind">
): RuntimeApplication {
  return {
    ...options,
    kind: "Application",
    parsedVersion: parseVersion(options.version),
  };
}
