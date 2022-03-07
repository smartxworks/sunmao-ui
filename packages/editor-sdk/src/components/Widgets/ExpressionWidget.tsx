import React, { useEffect, useMemo, useState, useRef } from 'react';
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
import { Type, Static } from '@sinclair/typebox';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { ExpressionEditor, ExpressionEditorHandle } from '../Form';
import { isExpression } from '../../utils/validator';

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

const getCode = (value: unknown): { code: string; type: string } => {
  const type = typeof value;
  if (type === 'object' || type === 'boolean') {
    value = JSON.stringify(value, null, 2);
  } else {
    value = String(value);
  }
  return {
    code: value as string,
    type,
  };
};

const getParsedValue = (raw: string, type: string) => {
  if (isExpression(raw)) {
    return raw;
  }
  if (type === 'object' || type === 'boolean') {
    try {
      return JSON.parse(raw);
    } catch (error) {
      // TODO: handle error
      return {};
    }
  }
  if (type === 'number') {
    return toNumber(raw);
  }
  return raw;
};

export const ExpressionWidgetOptionsSchema = Type.Object({
  compactOptions: Type.Optional(
    Type.Object({
      height: Type.Optional(Type.String()),
      paddingY: Type.Optional(Type.String()),
    })
  ),
});

export const ExpressionWidget: React.FC<
  WidgetProps<Static<typeof ExpressionWidgetOptionsSchema>>
> = props => {
  const { value, services, schema, onChange } = props;
  const { widgetOptions } = schema;
  const { stateManager } = services;
  const [defs, setDefs] = useState<any>();
  const editorRef = useRef<ExpressionEditorHandle>(null);
  const { code, type } = useMemo(() => {
    return getCode(value);
  }, [value]);

  useEffect(() => {
    setDefs([customTreeTypeDefCreator(stateManager.store)]);
  }, [stateManager]);
  useEffect(() => {
    editorRef.current?.setCode(code);
  }, [code]);

  return (
    <ExpressionEditor
      {...(widgetOptions?.compactOptions || {})}
      ref={editorRef}
      defaultCode={code}
      defs={defs}
      onBlur={_v => {
        const v = getParsedValue(_v, type);
        onChange(v);
      }}
    />
  );
};

export default implementWidget<Static<typeof ExpressionWidgetOptionsSchema>>({
  version: 'core/v1',
  metadata: {
    name: 'Expression',
  },
  spec: {
    options: ExpressionWidgetOptionsSchema,
  },
})(ExpressionWidget);
