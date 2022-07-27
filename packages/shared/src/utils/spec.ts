import { TLiteral, Type } from '@sinclair/typebox';
import {
  JSONSchema7Definition,
  JSONSchema7,
  JSONSchema7Type,
  JSONSchema7Object,
} from 'json-schema';
import { AnyTypePlaceholder } from '../constants';

export type IntoStringUnion<T> = {
  [K in keyof T]: T[K] extends string ? TLiteral<T[K]> : never;
};

export function StringUnion<T extends string[]>(values: [...T], options?: any) {
  return Type.KeyOf(
    Type.Object(
      values.reduce((prev, cur) => {
        prev[cur] = Type.Boolean();
        return prev;
      }, {} as Record<T[number], any>)
    ),
    options
  );
}

function getArray(
  items: JSONSchema7Definition[],
  returnPlaceholderForAny = false
): JSONSchema7Type[] {
  return items.map(item =>
    isJSONSchema(item)
      ? generateDefaultValueFromSpec(item, returnPlaceholderForAny)
      : null
  );
}

function getObject(
  spec: JSONSchema7,
  returnPlaceholderForAny = false
): JSONSchema7Object | string {
  const obj: JSONSchema7Object = {};

  if (spec.allOf && spec.allOf.length > 0) {
    return (getArray(spec.allOf, returnPlaceholderForAny) as JSONSchema7Object[]).reduce(
      (prev, cur) => {
        prev = Object.assign(prev, cur);
        return prev;
      },
      obj
    );
  }

  // if not specific property, treat it as any type
  if (!spec.properties) {
    if (returnPlaceholderForAny) {
      return AnyTypePlaceholder;
    }

    return {};
  }

  for (const key in spec.properties) {
    const subSpec = spec.properties?.[key];
    if (typeof subSpec === 'boolean') {
      obj[key] = null;
    } else if (subSpec) {
      obj[key] = generateDefaultValueFromSpec(subSpec, returnPlaceholderForAny);
    }
  }
  return obj;
}

export function generateDefaultValueFromSpec(
  spec: JSONSchema7,
  returnPlaceholderForAny = false
): JSONSchema7Type {
  // console.log(spec);
  if (!spec.type) {
    if ((spec.anyOf && spec.anyOf!.length > 0) || (spec.oneOf && spec.oneOf.length > 0)) {
      const subSpec = (spec.anyOf! || spec.oneOf)[0];
      if (typeof subSpec === 'boolean') return null;
      return generateDefaultValueFromSpec(subSpec, returnPlaceholderForAny);
    }

    // It is any type
    if (returnPlaceholderForAny) {
      return AnyTypePlaceholder;
    }
    return '';
  }

  if (spec.const) {
    return spec.const;
  }

  switch (true) {
    case Array.isArray(spec.type): {
      const subSpec = {
        type: spec.type[0],
      } as JSONSchema7;
      return generateDefaultValueFromSpec(subSpec, returnPlaceholderForAny);
    }
    case spec.type === 'string':
      if (spec.enum && spec.enum.length > 0) {
        return spec.enum[0];
      } else {
        return '';
      }
    case spec.type === 'boolean':
      return false;
    case spec.type === 'array':
      return spec.items
        ? Array.isArray(spec.items)
          ? getArray(spec.items, returnPlaceholderForAny)
          : isJSONSchema(spec.items)
          ? [generateDefaultValueFromSpec(spec.items, returnPlaceholderForAny)]
          : null
        : [];
    case spec.type === 'number':
    case spec.type === 'integer':
      return 0;
    case spec.type === 'object':
      return getObject(spec, returnPlaceholderForAny);
    case spec.type === 'null':
      return null;
    default:
      return {};
  }
}

export function isJSONSchema(spec?: JSONSchema7Definition): spec is JSONSchema7 {
  return spec !== undefined && typeof spec !== 'boolean';
}
