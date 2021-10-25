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
} from '@sinclair/typebox';

export function parseTypeBox(tSchema: TSchema): Static<typeof tSchema> {
  if (tSchema.modifier === OptionalModifier) {
    return undefined;
  }

  switch (tSchema.kind) {
    case StringKind:
      return '';
    case BooleanKind:
      return false;
    case ArrayKind:
      return [];
    case NumberKind:
      return 0;
    case IntegerKind:
      return 0;

    case ObjectKind:
      const obj: Static<typeof tSchema> = {};
      for (const key in tSchema.properties) {
        obj[key] = parseTypeBox(tSchema.properties[key]);
      }
      return obj;

    default:
      return {};
  }
}
