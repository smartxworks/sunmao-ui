import {
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isUndefined,
  isNull,
} from 'lodash';
import type { JSONSchema7 } from 'json-schema';
import { TSchema, Type } from '@sinclair/typebox';

const TypeMap = {
  undefined: 'Undefined',
  string: 'String',
  boolean: 'Boolean',
  number: 'Number',
  object: 'Object',
  function: 'Function',
  symbol: 'Symbol',
  bigint: 'BigInt',
};

export function getTypeString(value: any) {
  if (value === null) {
    return 'Null';
  } else if (value instanceof Array) {
    return 'Array';
  } else {
    return TypeMap[typeof value];
  }
}

export enum Types {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
  FUNCTION = 'FUNCTION',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  UNKNOWN = 'UNKNOWN',
}

export const getType = (value: unknown) => {
  if (isString(value)) return Types.STRING;
  if (isNumber(value)) return Types.NUMBER;
  if (isBoolean(value)) return Types.BOOLEAN;
  if (Array.isArray(value)) return Types.ARRAY;
  if (isFunction(value)) return Types.FUNCTION;
  if (isObject(value)) return Types.OBJECT;
  if (isUndefined(value)) return Types.UNDEFINED;
  if (isNull(value)) return Types.NULL;
  return Types.UNKNOWN;
};

const genSpec = (type: Types, target: any): TSchema => {
  switch (type) {
    case Types.ARRAY: {
      const arrayType = getType(target[0]);
      return Type.Array(genSpec(arrayType, target[0]));
    }
    case Types.OBJECT: {
      const objType: Record<string, any> = {};
      Object.keys(target).forEach(k => {
        const type = getType(target[k]);
        objType[k] = genSpec(type, target[k]);
      });
      return Type.Object(objType);
    }
    case Types.STRING:
      return Type.String();
    case Types.NUMBER:
      return Type.Number();
    case Types.BOOLEAN:
      return Type.Boolean();
    case Types.NULL:
    case Types.UNDEFINED:
      return Type.Any();
    default:
      return Type.Any();
  }
};
export const json2JsonSchema = (value: any): JSONSchema7 => {
  const type = getType(value);
  return genSpec(type, value) as JSONSchema7;
};
