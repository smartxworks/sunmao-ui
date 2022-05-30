import { JSONSchema7 } from 'json-schema';
import { Metadata } from './metadata';
import { parseVersion, type Version } from './version';

export type UtilMethodSpec = {
  parameters: JSONSchema7;
};

export type UtilMethod = {
  version: string;
  king: 'UtilMethod';
  metadata: Metadata;
  spec: UtilMethodSpec;
};

export type RuntimeUtilMethod = UtilMethod & {
  parsedVersion: Version;
};

export type CreateUtilMethodOptions = Omit<UtilMethod, 'king'>;

export function createUtilMethod(options: CreateUtilMethodOptions): RuntimeUtilMethod {
  return {
    ...options,
    king: 'UtilMethod',
    parsedVersion: parseVersion(options.version),
  };
}
