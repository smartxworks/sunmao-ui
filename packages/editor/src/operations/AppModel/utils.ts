import { ApplicationComponent, ComponentTrait } from '@sunmao-ui/core';
import { registry } from '../../setup';
import { FieldModel } from './FieldModel';

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

export function getPropertyObject(
  properties: Record<string, FieldModel>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key in properties) {
    result[key] = properties[key].value;
  }
  return result;
}
