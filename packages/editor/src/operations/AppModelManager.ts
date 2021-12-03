import { ApplicationComponent } from '@sunmao-ui/core';
import { genOperation } from '.';
import { eventBus } from '../eventBus';
import { PasteManager } from './PasteManager';
import { IUndoRedoManager, IOperation, OperationList } from './type';

export class AppModelManager implements IUndoRedoManager {
  components: ApplicationComponent[] = [];
  operationStack: OperationList<IOperation> = new OperationList();
  pasteManager = new PasteManager();

  constructor() {
    eventBus.on('undo', () => this.undo());
    eventBus.on('redo', () => this.redo());
    eventBus.on('operation', o => this.do(o));
    eventBus.on('cutComponent', ({ componentId }) =>
      this.pasteManager.cutComponent(componentId, this.components)
    );
    eventBus.on('paste', ({ componentId }) => {
      console.log('componentId', componentId)
      eventBus.send(
        'operation',
        genOperation('pasteComponent', {
          parentId: componentId,
          slot: 'content',
          components: this.pasteManager.componentsCache,
        })
      );
    });
    eventBus.on('componentsRefresh', components => {
      this.components = components;
      this.operationStack = new OperationList();
    });
  }

  updateComponents(components: ApplicationComponent[]) {
    this.components = components;
    eventBus.send('componentsChange', this.components);
  }

  do(operation: IOperation): void {
    // TODO: replace by logger
    // console.log('do', operation);
    const newComponents = operation.do(this.components);
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
    const newComponents = this.operationStack.cursor?.val?.redo(this.components);
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
    const newComponents = this.operationStack.cursor.next?.val?.undo(this.components);
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
