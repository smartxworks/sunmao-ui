import { ApplicationComponent } from '@sunmao-ui/core';
import { getComponentAndChildrens } from './util';

export class PasteManager {
  rootComponentId = ''
  componentsCache: ApplicationComponent[] = [];
  copyTimes = 0;

  setPasteComponents(componentId: string, allComponents: ApplicationComponent[]) {
    this.rootComponentId = componentId;
    const children = getComponentAndChildrens(componentId, allComponents);
    this.componentsCache = [...children];
  }
}
