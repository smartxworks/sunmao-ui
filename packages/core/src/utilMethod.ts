import { JSONSchema7 } from 'json-schema';
import { Metadata } from './metadata';
import { parseVersion, type Version } from './version';

export type UtilMethodSpec = {
  parameters: JSONSchema7;
};

export type UtilMethod = {
  version: string;
  kind: 'UtilMethod';
  metadata: Metadata;
  spec: UtilMethodSpec;
};

export type RuntimeUtilMethod = UtilMethod & {
  parsedVersion: Version;
};

export type CreateUtilMethodOptions = Omit<UtilMethod, 'kind'>;

export function createUtilMethod(options: CreateUtilMethodOptions): RuntimeUtilMethod {
  return {
    ...options,
    kind: 'UtilMethod',
    parsedVersion: parseVersion(options.version),
  };
}
