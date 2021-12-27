import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { registry } from '../setup';

export function genComponent(
  type: string,
  id: string,
  properties?: Record<string, unknown>,
  traits: ComponentTrait[] = []
): ApplicationComponent {
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
): ComponentTrait {
  return {
    type,
    properties,
  };
}
