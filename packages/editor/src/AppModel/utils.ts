import { ComponentSchema, TraitSchema } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';

export function genComponent(
  registry: Registry,
  type: string,
  id: string,
  properties?: Record<string, unknown>,
  traits: TraitSchema[] = [],
): ComponentSchema {
  const cImpl = registry.getComponentByType(type);
  const initProperties = properties || cImpl.metadata.exampleProperties;
  return {
    id,
    type: type,
    properties: initProperties,
    traits,
  };
}

export function genTrait(
  type: string,
  properties: Record<string, unknown> = {}
): TraitSchema {
  return {
    type,
    properties,
  };
}
