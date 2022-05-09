import {
  TLiteral,
  Type,
  ArrayKind,
  BooleanKind,
  IntegerKind,
  NumberKind,
  ObjectKind,
  Static,
  StringKind,
  TSchema,
  OptionalModifier,
  UnionKind,
  AnyKind,
} from '@sinclair/typebox';
import { JSONSchema7Definition, JSONSchema7 } from 'json-schema';

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
    {
      title: options?.title,
      description: options?.description,
      category: options?.category,
      weight: options?.weight,
    }
  );
}

export function parseTypeBox(spec: TSchema, noOptional = false): Static<typeof spec> {
  if (spec.modifier === OptionalModifier && !noOptional) {
    return undefined;
  }

  switch (true) {
    case spec.type === 'string' && 'enum' in spec && spec.enum.length > 0:
      return spec.enum[0];
    case spec.kind === StringKind:
      return '';
    case spec.kind === BooleanKind:
      return false;
    case spec.kind === ArrayKind:
      return [];
    case spec.kind === NumberKind:
    case spec.kind === IntegerKind:
      return 0;
    case spec.kind === ObjectKind: {
      const obj: Static<typeof spec> = {};
      for (const key in spec.properties) {
        obj[key] = parseTypeBox(spec.properties[key], noOptional);
      }
      return obj;
    }
    case spec.kind === UnionKind && 'anyOf' in spec && spec.anyOf.length > 0:
    case spec.kind === UnionKind && 'oneOf' in spec && spec.oneOf.length > 0: {
      const subSpec = (spec.anyOf || spec.oneOf)[0];
      return parseTypeBox(subSpec, noOptional);
    }
    case spec.kind === AnyKind:
      return undefined;
    default:
      return {};
  }
}

export function isJSONSchema(spec?: JSONSchema7Definition): spec is JSONSchema7 {
  return spec !== undefined && typeof spec !== 'boolean';
}
