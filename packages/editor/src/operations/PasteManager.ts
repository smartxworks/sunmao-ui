import { ApplicationComponent } from '@sunmao-ui/core';
import { getComponentAndChildrens } from './util';

export class PasteManager {
  componentsCache: ApplicationComponent[] = [];
  copyTimes = 0;

  setPasteComponents(componentId: string, allComponents: ApplicationComponent[]) {
    const children = getComponentAndChildrens(componentId, allComponents);
    this.componentsCache = [...children];
    this.copyTimes = 0;
  }
}
