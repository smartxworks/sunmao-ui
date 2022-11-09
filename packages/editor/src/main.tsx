import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RegistryInterface } from '@sunmao-ui/runtime';
import { sunmaoChakraUILib, widgets as chakraWidgets } from '@sunmao-ui/chakra-ui-lib';
import { ArcoDesignLib, widgets as arcoWidgets } from '@sunmao-ui/arco-lib';
import { initSunmaoUIEditor } from './init';
import { LocalStorageManager } from './LocalStorageManager';
import '@sunmao-ui/arco-lib/dist/index.css';

type Options = Partial<{
  components: Parameters<RegistryInterface['registerComponent']>[0][];
  traits: Parameters<RegistryInterface['registerTrait']>[0][];
  modules: Parameters<RegistryInterface['registerModule']>[0][];
  container: Element;
}>;

const lsManager = new LocalStorageManager();
const { Editor, registry } = initSunmaoUIEditor({
  widgets: [...chakraWidgets, ...arcoWidgets],
  storageHandler: {
    onSaveApp(app) {
      lsManager.saveAppInLS(app);
    },
    onSaveModules(modules) {
      lsManager.saveModulesInLS(modules);
    },
  },
  defaultApplication: lsManager.getAppFromLS(),
  defaultModules: lsManager.getModulesFromLS(),
  runtimeProps: {
    libs: [sunmaoChakraUILib, ArcoDesignLib],
    isInEditor: true,
  },
});

export default function renderApp(options: Options = {}) {
  const {
    components = [],
    traits = [],
    modules = [],
    container = document.getElementById('root'),
  } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(m));

  ReactDOM.render(
    <StrictMode>
      <Editor />
    </StrictMode>,
    container
  );
}
