import { ApplicationComponent, Application } from '@sunmao-ui/core';
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

export function genId(componentType: string, app: Application): string {
  const { name } = parseType(componentType);
  const componentsCount = app.spec.components.filter(
    component => component.type === componentType
  ).length;
  return `${name}${componentsCount + 1}`;
}

export function getAllComponents(app: Application): ApplicationComponent[] {
  return app.spec.components.reduce((acc, component) => {
    acc.push(component);
    return acc;
  }, [] as ApplicationComponent[]);
}

export function tryOriginal<T>(val: T): T {
  return isDraft(val) ? (original(val) as T) : val;
}
