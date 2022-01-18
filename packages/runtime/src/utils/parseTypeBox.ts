import {
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
} from '@sinclair/typebox';

export function parseTypeBox(tSchema: TSchema, noOptional = false): Static<typeof tSchema> {
  if (tSchema.modifier === OptionalModifier && !noOptional) {
    return undefined;
  }

  switch (true) {
    case tSchema.type === 'string' && 'enum' in tSchema && tSchema.enum.length > 0:
      return tSchema.enum[0];
    case tSchema.kind === StringKind:
      return '';
    case tSchema.kind === BooleanKind:
      return false;
    case tSchema.kind === ArrayKind:
      return [];
    case tSchema.kind === NumberKind:
    case tSchema.kind === IntegerKind:
      return 0;
    case tSchema.kind === ObjectKind: {
      const obj: Static<typeof tSchema> = {};
      for (const key in tSchema.properties) {
        obj[key] = parseTypeBox(tSchema.properties[key], noOptional);
      }
      return obj;
    }
    case tSchema.kind === UnionKind && 'anyOf' in tSchema && tSchema.anyOf.length > 0:
    case tSchema.kind === UnionKind && 'oneOf' in tSchema && tSchema.oneOf.length > 0: {
      const subSchema = (tSchema.anyOf || tSchema.oneOf)[0];
      return parseTypeBox(subSchema, noOptional);
    }
    default:
      return {};
  }
}
