import { Application } from '@meta-ui/core';
import { RuntimeApplicationComponent } from '../types/RuntimeSchema';

// parse component Type
export function parseType(v: string) {
  const TYPE_REG = /^([a-zA-Z0-9_\d]+\/[a-zA-Z0-9_\d]+)\/([a-zA-Z0-9_\d]+)$/;
  function isValidType(v: string): boolean {
    return TYPE_REG.test(v);
  }
  if (!isValidType(v)) {
    throw new Error(`Invalid type string: "${v}"`);
  }

  const [, version, name] = v.match(TYPE_REG) ?? [];
  return {
    version,
    name,
  };
}

export function parseTypeComponents(
  c: Application['spec']['components'][0]
): RuntimeApplicationComponent {
  return {
    ...c,
    parsedType: parseType(c.type),
    traits: c.traits.map(t => {
      return {
        ...t,
        parsedType: parseType(t.type),
      };
    }),
  };
}
