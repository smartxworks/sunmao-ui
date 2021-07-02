import { Metadata } from "./metadata";
import { parseVersion, Version } from "./version";

// spec

export type Scope = {
  version: string;
  kind: "Scope";
  metadata: Metadata;
};

// extended runtime
export type RuntimeScope = Scope & {
  parsedVersion: Version;
};

export function createScope(options: Omit<Scope, "kind">): RuntimeScope {
  return {
    ...options,
    kind: "Scope",
    parsedVersion: parseVersion(options.version),
  };
}
