import { JSONSchema7Definition, JSONSchema7 } from 'json-schema';

export function isJSONSchema(spec?: JSONSchema7Definition): spec is JSONSchema7 {
  return spec !== undefined && typeof spec !== 'boolean';
}
