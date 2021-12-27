import { IFieldModel } from './IAppModel';

const regExp = new RegExp('.*{{.*}}.*');

export class FieldModel implements IFieldModel {
  value: any;
  isDynamic = false;
  // refs: Array<ComponentId | ModuleId> = []

  constructor(value: unknown) {
    this.update(value);
  }

  update(value: unknown) {
    this.value = value;
    this.isDynamic = typeof value === 'string' && regExp.test(value);
  }
}
