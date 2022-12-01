import { IComponentModel } from '../AppModel/IAppModel';

export class PasteManager {
  componentCache: IComponentModel | undefined;

  setPasteComponents(component: IComponentModel) {
    this.componentCache = component;
  }
}
