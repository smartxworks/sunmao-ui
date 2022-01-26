import { IComponentModel } from '../AppModel/IAppModel';

export class PasteManager {
  rootComponentId = ''
  componentCache: IComponentModel | undefined;
  copyTimes = 0;

  setPasteComponents(componentId: string, component: IComponentModel) {
    this.rootComponentId = componentId;
    this.componentCache = component;
  }
}
