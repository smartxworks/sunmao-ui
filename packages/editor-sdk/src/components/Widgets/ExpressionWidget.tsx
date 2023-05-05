import React, { useEffect, useMemo, useCallback, useState, useRef } from 'react';
import { toNumber, debounce } from 'lodash';
import { Type, Static } from '@sinclair/typebox';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { ExpressionEditor, ExpressionEditorHandle } from '../Form';
import { isExpression } from '../../utils/validator';
import { getType, getTypeString, Types } from '../../utils/type';
import { ValidateFunction } from 'ajv';
import { ExpressionError } from '@sunmao-ui/runtime';
import { CORE_VERSION, CoreWidgetName, initAjv } from '@sunmao-ui/shared';

// FIXME: move into a new package and share with runtime?
export function isNumeric(x: string | number) {
  return !isNaN(Number(x)) && x !== '';
}

// highly inspired by appsmith
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

const getCode = (value: unknown): string => {
  const type = typeof value;
  let code = '';

  if (value === undefined || value === null) {
    code = '';
  } else if (type === 'object' || type === 'boolean') {
    code = `{{${JSON.stringify(value, null, 2)}}}`;
  } else if (type === 'number') {
    code = `{{${value}}}`;
  } else {
    code = String(value);
  }

  return code;
};

const getParsedValue = (raw: string, type: string) => {
  if (isExpression(raw)) {
    return raw;
  }

  if (type === 'object' || type === 'array' || type === 'boolean') {
    try {
      return JSON.parse(raw);
    } catch (error) {
      // TODO: handle error
      return raw;
    }
  }

  if (type === 'number') {
    return toNumber(raw);
  }

  return raw;
};

export const ExpressionWidgetOptionsSpec = Type.Object({
  compactOptions: Type.Optional(
    Type.Object({
      height: Type.Optional(Type.String()),
      paddingY: Type.Optional(Type.String()),
      isHiddenExpand: Type.Optional(Type.Boolean()),
    })
  ),
});

type ExpressionWidgetType = `${typeof CORE_VERSION}/${CoreWidgetName.Expression}`;
type Container = { id: string; slot: string };
declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/expression': Static<typeof ExpressionWidgetOptionsSpec>;
  }
}

export const ExpressionWidget: React.FC<WidgetProps<ExpressionWidgetType>> = props => {
  const { value, services, spec, component, onChange } = props;
  const { widgetOptions } = spec;
  const { stateManager } = services;
  const code = useMemo(() => getCode(value), [value]);
  // if the spec has the only one type, then use its type
  // otherwise, keep the expression as the string type
  const type = typeof spec.type === 'string' ? spec.type : 'string';
  const [defs, setDefs] = useState<any>();
  const [evaledValue, setEvaledValue] = useState<any>({ value: null });
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<ExpressionEditorHandle>(null);
  const validateFuncRef = useRef<ValidateFunction | null>(null);
  const slotTrait = useMemo(() => {
    if (component.traits) {
      return component.traits.find(trait =>
        ['core/v1/slot', 'core/v2/slot'].includes(trait.type)
      );
    }
    return undefined;
  }, [component]);
  const $slot = useMemo(
    () =>
      slotTrait
        ? Object.entries(services.stateManager.slotStore).find(([key]) => {
            const { id, slot } = slotTrait.properties.container as Container;

            return key.includes(`${id}_${slot}`);
          })?.[1]
        : null,
    [services.stateManager.slotStore, slotTrait]
  );

  const evalCode = useCallback(
    async (code: string) => {
      try {
        const value = getParsedValue(code, type);
        const result = isExpression(value)
          ? services.stateManager.deepEval(value, {
              scopeObject: { $slot },
              overrideSlot: true,
            })
          : value;

        if (result instanceof ExpressionError) {
          throw result;
        }

        if (!validateFuncRef.current) {
          const { default: Ajv } = await import('ajv');

          const ajv = initAjv(new Ajv());
          validateFuncRef.current = ajv.compile(spec);
        }

        validateFuncRef.current(result);

        if (validateFuncRef.current.errors?.length) {
          const err = validateFuncRef.current.errors[0];

          if (err.keyword === 'type') {
            throw new TypeError(
              `Invalid value, expected ${spec.type} but got ${getTypeString(
                result
              ).toLowerCase()}`
            );
          } else if (err.keyword === 'enum') {
            throw new TypeError(
              `${err.message}: ${JSON.stringify(err.params.allowedValues)}`
            );
          } else {
            throw new TypeError(err.message);
          }
        }

        setEvaledValue({
          value: result,
        });
        setError(null);
      } catch (err) {
        setError(String(err));
      }
    },
    [services, type, spec]
  );
  const onCodeChange = useMemo(() => debounce(evalCode, 300), [evalCode]);
  const onFocus = useCallback(() => {
    evalCode(code);
  }, [code, evalCode]);

  useEffect(() => {
    setDefs([customTreeTypeDefCreator({ ...stateManager.store, $slot })]);
  }, [stateManager, $slot]);
  useEffect(() => {
    editorRef.current?.setCode(code);
  }, [code]);

  return (
    <ExpressionEditor
      compactOptions={{
        maxHeight: '125px',
        ...(widgetOptions?.compactOptions || {}),
      }}
      ref={editorRef}
      defaultCode={code}
      evaledValue={evaledValue}
      error={error}
      defs={defs}
      onChange={onCodeChange}
      onBlur={onChange}
      onFocus={onFocus}
    />
  );
};

export default implementWidget<ExpressionWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: CoreWidgetName.Expression,
  },
  spec: {
    options: ExpressionWidgetOptionsSpec,
  },
})(ExpressionWidget);
