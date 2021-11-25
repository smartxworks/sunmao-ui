import { ChakraProvider } from '@chakra-ui/react';
import { initSunmaoUI } from '@sunmao-ui/runtime';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { AppStorage } from './AppStorage';

import { Editor } from './components/Editor';
import { AppModelManager } from './operations/AppModelManager';

type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
}>;

export default function renderApp(options: Options = {}) {
  const ui = initSunmaoUI();

  const App = ui.App;
  const registry = ui.registry;
  const apiService = ui.apiService;
  const stateStore = ui.stateManager.store;
  const appStorage = new AppStorage(registry);
  const appModelManager = new AppModelManager(registry, appStorage.components);

  const { components = [], traits = [], modules = [] } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(m));
  appStorage.modules.forEach(m => registry.registerModule(m));

  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Editor
          App={App}
          registry={registry}
          stateStore={stateStore}
          appModelManager={appModelManager}
          apiService={apiService}
          appStorage={appStorage}
        />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}
