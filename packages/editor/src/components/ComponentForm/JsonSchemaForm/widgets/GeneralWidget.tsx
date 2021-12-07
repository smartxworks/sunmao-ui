import React, { useEffect, useState } from 'react';
import { FieldProps } from '../fields';
import { TernEditor } from 'components/CodeEditor';
import { stateStore } from 'setup';
import _ from 'lodash-es';

type Props = FieldProps;

export enum Types {
  URL = 'URL',
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
  if (_.isString(value)) return Types.STRING;
  if (_.isNumber(value)) return Types.NUMBER;
  if (_.isBoolean(value)) return Types.BOOLEAN;
  if (Array.isArray(value)) return Types.ARRAY;
  if (_.isFunction(value)) return Types.FUNCTION;
  if (_.isObject(value)) return Types.OBJECT;
  if (_.isUndefined(value)) return Types.UNDEFINED;
  if (_.isNull(value)) return Types.NULL;
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

const GeneralWidget: React.FC<Props> = props => {
  const { formData, onChange } = props;
  const [defs, setDefs] = useState<any>();
  useEffect(() => {
    setDefs([customTreeTypeDefCreator(stateStore)]);
  }, []);

  return (
    <TernEditor
      defaultCode={String(formData)}
      lineNumbers={false}
      onBlur={v => {
        onChange(v);
      }}
      defs={defs}
    />
  );
};

export default GeneralWidget;
