import { ComponentSchema } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import { EventBusType } from '../services/eventBus';
import { AppModel } from '../AppModel/AppModel';
import { IUndoRedoManager, IOperation, OperationList } from './type';

export class AppModelManager implements IUndoRedoManager {
  appModel: AppModel;
  operationStack: OperationList<IOperation> = new OperationList();

  constructor(private eventBus: EventBusType, private registry: Registry, initComponents: ComponentSchema[]) {
    this.appModel = new AppModel(initComponents, this.registry)
  
    eventBus.on('undo', () => this.undo());
    eventBus.on('redo', () => this.redo());
    eventBus.on('operation', o => this.do(o));
    eventBus.on('componentsRefresh', components => {
      this.appModel = new AppModel(components, this.registry);
      this.operationStack = new OperationList();
    });
  }

  updateComponents(appModel: AppModel) {
    this.appModel = appModel;
    this.eventBus.send('componentsChange', this.appModel.toSchema());
  }

  do(operation: IOperation): void {
    // TODO: replace by logger
    // console.log('do', operation);
    const newComponents = operation.do(this.appModel);
    this.operationStack.insert(operation);
    this.updateComponents(newComponents);
  }

  redo(): void {
    if (!this.operationStack.cursor.next) {
      return;
    }
    try {
      this.operationStack.moveNext();
    } catch {
      console.warn('cannot redo as cannot move to next cursor', this.operationStack);
      return;
    }
    const newComponents = this.operationStack.cursor?.val?.redo(this.appModel);
    // console.log('redo', this.operationStack.cursor?.val);
    if (newComponents) {
      this.updateComponents(newComponents);
    } else {
      // rollback move next
      this.operationStack.movePrev();
      console.warn('cannot redo as next cursor has no operation', this.operationStack);
    }
  }

  undo(): void {
    if (!this.operationStack.cursor.prev) {
      return;
    }
    try {
      this.operationStack.movePrev();
    } catch {
      console.warn('cannot undo as cannot move to prev cursor', this.operationStack);
      return;
    }
    const newComponents = this.operationStack.cursor.next?.val?.undo(this.appModel);
    // console.log('undo', this.operationStack.cursor.next?.val);
    if (newComponents) {
      this.updateComponents(newComponents);
    } else {
      //rollback move prev
      this.operationStack.moveNext();
      console.warn('cannot undo as cursor has no operation', this.operationStack);
    }
  }
}
