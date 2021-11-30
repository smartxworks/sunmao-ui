import { ApplicationComponent } from '@sunmao-ui/core';
import { parseType } from '@sunmao-ui/runtime';
import { isDraft, original } from 'immer';
import { registry } from '../setup';

export function genComponent(type: string, id: string): ApplicationComponent {
  const { version, name } = parseType(type);
  const cImpl = registry.getComponent(version, name);
  const initProperties = cImpl.metadata.exampleProperties;
  return {
    id,
    type: type,
    properties: initProperties,
    traits: [],
  };
}

export function genId(componentType: string, components: ApplicationComponent[]): string {
  const { name } = parseType(componentType);
  const componentsCount = components.filter(
    component => component.type === componentType
  ).length;
  return `${name}${componentsCount + 1}`;
}

export function tryOriginal<T>(val: T): T {
  return isDraft(val) ? (original(val) as T) : val;
}
