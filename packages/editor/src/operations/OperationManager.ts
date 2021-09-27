import { Application, ComponentTrait, ApplicationComponent } from '@meta-ui/core';
import { parseType, parseTypeBox } from '@meta-ui/runtime';
import {
  BaseOperation,
  CreateComponentOperation,
  OperationKind,
  RemoveComponentOperation,
} from './Operations';
import { produce } from 'immer';
import { registry } from '../metaUI';

// function genTrait(type: string): ComponentTrait {
//   const { version, name } = parseType(type);
//   const traitImpl = registry.getTrait(version, name);
//   const initProperties = parseTypeBox(traitImpl.spec.properties as any);
//   return {
//     type,
//     properties: initProperties,
//   };
// }

function genSlotTrait(parentId: string, slot: string): ComponentTrait {
  return {
    type: 'core/v1/slot',
    properties: {
      container: {
        id: parentId,
        slot: slot,
      },
    },
  };
}
let count = 0;
function genComponent(
  type: string,
  parentId: string,
  slot: string
): ApplicationComponent {
  const { version, name } = parseType(type);
  const cImpl = registry.getComponent(version, name);
  const initProperties = parseTypeBox(cImpl.spec.properties as any);
  count++;
  return {
    id: `${name}${count}`,
    type: type,
    properties: initProperties,
    traits: [genSlotTrait(parentId, slot)],
  };
}

export class OperationManager {
  private undoStack: BaseOperation[] = [];

  constructor(public app: Application) {}

  undo(): Application {
    if (this.undoStack.length === 0) {
      return this.app;
    }
    const o = this.undoStack.pop()!;
    return this.apply(o, true);
  }

  apply(o: BaseOperation, noEffect = false): Application {
    let newApp;
    switch (o.kind) {
      case OperationKind.createComponent:
        const createO = o as CreateComponentOperation;
        const newComponent = genComponent(
          createO.componentType,
          createO.parentId,
          createO.slot
        );
        if (!noEffect) {
          const undoOperation = new RemoveComponentOperation(newComponent.id);
          this.undoStack.push(undoOperation);
        }
        newApp = produce(this.app, draft => {
          draft.spec.components.push(newComponent);
        });
        break;
      case OperationKind.removeComponent:
        const removeO = o as RemoveComponentOperation;
        newApp = produce(this.app, draft => {
          const i = draft.spec.components.findIndex(c => c.id === removeO.componentId);
          draft.spec.components.splice(i, 1);
        });
        break;
    }
    this.app = newApp;
    return newApp;
  }
}
