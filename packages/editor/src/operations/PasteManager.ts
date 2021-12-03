import { ApplicationComponent } from '@sunmao-ui/core';
import { getComponentAndChildrens } from './util';

export class PasteManager {
  componentsCache: ApplicationComponent[] = [];

  cutComponent(componentId: string, allComponents: ApplicationComponent[]) {
    const children = getComponentAndChildrens(componentId, allComponents);
    this.componentsCache = [...children];
    console.log('componentsCache', this.componentsCache)
  }
}
