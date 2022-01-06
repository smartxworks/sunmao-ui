import { ComponentSchema } from '@sunmao-ui/core';
import { getComponentAndChildrens } from './util';

export class PasteManager {
  rootComponentId = ''
  componentsCache: ComponentSchema[] = [];
  copyTimes = 0;

  setPasteComponents(componentId: string, allComponents: ComponentSchema[]) {
    this.rootComponentId = componentId;
    const children = getComponentAndChildrens(componentId, allComponents);
    this.componentsCache = [...children];
  }
}
