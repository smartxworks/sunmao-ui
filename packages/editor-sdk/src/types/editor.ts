import { ComponentSchema } from '@sunmao-ui/core';
import { RegistryInterface, UIServices } from '@sunmao-ui/runtime';
import WidgetManager from '../models/WidgetManager';
import type { Operations } from '../types/operation';

export interface EditorServicesInterface extends UIServices {
  registry: RegistryInterface;
  editorStore: {
    components: ComponentSchema[];
    currentEditingTarget: {
      kind: 'app' | 'module';
      version: string;
      name: string;
    };
  };
  appModelManager: {
    appModel: any;
    doOperations: (operations: Operations) => void;
  };
  widgetManager: WidgetManager;
}
