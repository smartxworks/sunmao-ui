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
import { RuntimeApplication } from '../../../core/typings';
import { registry } from '../registry';
import { stateStore } from '../store';

function parseTypeBox(tSchema: TSchema): Static<typeof tSchema> {
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
    case ArrayKind:
      return [];
    case ArrayKind:
      return [];

    case ObjectKind:
      const obj: Static<typeof tSchema> = {};
      for (let key in tSchema.properties) {
        obj[key] = parseTypeBox(tSchema.properties[key]);
      }
      return obj;

    default:
      return undefined;
  }
}

export function initStateAndMethod(
  components: RuntimeApplication['spec']['components']
) {
  components.forEach(c => {
    let state = {};
    c.traits.forEach(t => {
      const tSpec = registry.getTrait(
        t.parsedType.version,
        t.parsedType.name
      ).spec;
      (window as any).parseTypeBox = parseTypeBox;
      state = { ...state, ...parseTypeBox(tSpec.state as TSchema) };
    });
    const cSpec = registry.getComponent(
      c.parsedType.version,
      c.parsedType.name
    ).spec;
    state = { ...state, ...parseTypeBox(cSpec.state as TSchema) };
    stateStore[c.id] = state;
  });
}
