import { Application, ComponentTrait, ApplicationComponent } from '@meta-ui/core';
import { parseType } from '@meta-ui/runtime';
import {
  Operations,
  CreateComponentOperation,
  RemoveComponentOperation,
  ModifyComponentPropertyOperation,
} from './Operations';
import { produce } from 'immer';
import { registry } from '../metaUI';
import { eventBus } from '../eventBus';

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
  slot: string,
  id?: string
): ApplicationComponent {
  const { version, name } = parseType(type);
  const cImpl = registry.getComponent(version, name);
  const initProperties = cImpl.metadata.defaultProperties;
  count++;
  return {
    id: id || `${name}${count}`,
    type: type,
    properties: initProperties,
    traits: [genSlotTrait(parentId, slot)],
  };
}

export class AppModelManager {
  private undoStack: Operations[] = [];
  private app: Application;

  constructor(app: Application) {
    const appFromLS = localStorage.getItem('schema');
    if (appFromLS) {
      this.app = JSON.parse(appFromLS);
    } else {
      this.app = app;
    }

    eventBus.on('undo', () => this.undo());
    eventBus.on('operation', o => this.apply(o));
  }

  getApp() {
    return this.app;
  }

  updateApp(app: Application) {
    eventBus.send('appChange', app);
    localStorage.setItem('schema', JSON.stringify(app));
    this.app = app;
  }

  undo() {
    if (this.undoStack.length === 0) {
      return this.app;
    }
    const o = this.undoStack.pop()!;
    this.apply(o, true);
  }

  apply(o: Operations, noEffect = false) {
    let newApp = this.app;
    switch (o.kind) {
      case 'createComponent':
        const createO = o as CreateComponentOperation;
        const newComponent = genComponent(
          createO.componentType,
          createO.parentId,
          createO.slot,
          createO.componentId
        );
        if (!noEffect) {
          const undoOperation = new RemoveComponentOperation(newComponent.id);
          this.undoStack.push(undoOperation);
        }
        newApp = produce(this.app, draft => {
          draft.spec.components.push(newComponent);
        });
        break;
      case 'removeComponent':
        const removeO = o as RemoveComponentOperation;
        newApp = produce(this.app, draft => {
          const i = draft.spec.components.findIndex(c => c.id === removeO.componentId);
          draft.spec.components.splice(i, 1);
        });
        break;
      case 'modifyComponentProperty':
        const mo = o as ModifyComponentPropertyOperation;
        newApp = produce(this.app, draft => {
          return draft.spec.components.forEach(c => {
            if (c.id === mo.componentId) {
              c.properties[mo.propertyKey] = mo.propertyValue;
            }
          });
        });
        if (!noEffect) {
          const oldValue = this.app.spec.components.find(c => c.id === mo.componentId)
            ?.properties[mo.propertyKey];
          const undoOperation = new ModifyComponentPropertyOperation(
            mo.componentId,
            mo.propertyKey,
            oldValue
          );
          this.undoStack.push(undoOperation);
        }
        break;
    }
    this.updateApp(newApp);
  }
}
