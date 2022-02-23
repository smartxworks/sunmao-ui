import { IComponentModel } from '../AppModel/IAppModel';

export class PasteManager {
  componentCache: IComponentModel | undefined;
  copyTimes = 0;

  setPasteComponents(component: IComponentModel) {
    this.componentCache = component;
  }
}
