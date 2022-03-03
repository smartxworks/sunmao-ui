import { ComponentSchema } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime';
import WidgetManager from '../models/WidgetManager';

export interface EditorServices {
  registry: Registry;
  editorStore: {
    components: ComponentSchema[];
  };
  appModelManager: {
    appModel: any;
  };
  stateManager: {
    store: Record<string, any>;
  };
  widgetManager: WidgetManager;
}
