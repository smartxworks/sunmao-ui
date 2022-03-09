import { JSONSchema7Definition, JSONSchema7 } from 'json-schema';

export function isJSONSchema(schema?: JSONSchema7Definition): schema is JSONSchema7 {
  return schema !== undefined && typeof schema !== 'boolean';
}
