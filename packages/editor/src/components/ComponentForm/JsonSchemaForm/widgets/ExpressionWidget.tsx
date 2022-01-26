import React, { useEffect, useState } from 'react';
import {
  toNumber,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isObject,
  isUndefined,
  isNull,
} from 'lodash-es';
import { FieldProps } from '../fields';
import { ExpressionEditor } from '../../../CodeEditor';

type Props = FieldProps;

// FIXME: move into a new package and share with runtime?
export function isNumeric(x: string | number) {
  return !isNaN(Number(x)) && x !== '';
}

// highly inspired by appsmith
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

function generateTypeDef(
  obj: any
): string | Record<string, string | Record<string, unknown>> {
  const type = getType(obj);
  switch (type) {
    case Types.ARRAY: {
      const arrayType = getType(obj[0]);
      return `[${arrayType}]`;
    }
    case Types.OBJECT: {
      const objType: Record<string, string | Record<string, unknown>> = {};
      Object.keys(obj).forEach(k => {
        objType[k] = generateTypeDef(obj[k]);
      });
      return objType;
    }
    case Types.STRING:
      return 'string';
    case Types.NUMBER:
      return 'number';
    case Types.BOOLEAN:
      return 'bool';
    case Types.NULL:
    case Types.UNDEFINED:
      return '?';
    default:
      return '?';
  }
}

let extraDefs: any = {};

const customTreeTypeDefCreator = (dataTree: Record<string, Record<string, unknown>>) => {
  const def: any = {
    '!name': 'customDataTree',
  };
  Object.keys(dataTree).forEach(entityName => {
    const entity = dataTree[entityName];
    def[entityName] = generateTypeDef(entity);
  });
  def['!define'] = { ...extraDefs };
  extraDefs = {};
  return { ...def };
};

export const ExpressionWidget: React.FC<Props> = props => {
  const { formData, onChange, stateManager } = props;
  const [defs, setDefs] = useState<any>();
  useEffect(() => {
    setDefs([customTreeTypeDefCreator(stateManager.store)]);
  }, [stateManager]);

  return (
    <ExpressionEditor
      // TODO: better serialization
      defaultCode={String(formData)}
      onBlur={_v => {
        // TODO: move into expression editor?
        let v: string | number | boolean = _v;
        if (isNumeric(v)) {
          v = toNumber(v);
        } else if (v === 'true') {
          v = true;
        } else if (v === 'false') {
          v = false;
        }
        onChange(v);
      }}
      defs={defs}
    />
  );
};
