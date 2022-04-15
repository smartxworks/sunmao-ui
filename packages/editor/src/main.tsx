import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Registry } from '@sunmao-ui/runtime';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
import { widgets as chakraWidgets } from '@sunmao-ui/chakra-ui-lib/dist/esm/widgets/index';
import { ArcoDesignLib } from '@sunmao-ui/arco-lib';
import { initSunmaoUIEditor } from './init';
import { LocalStorageManager } from './LocalStorageManager';

type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
  container: Element;
}>;

const lsManager = new LocalStorageManager();
const { Editor, registry } = initSunmaoUIEditor({
  libs: [sunmaoChakraUILib, ArcoDesignLib],
  widgets: [...chakraWidgets],
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
  uiProps: {
    explorerMenuLazyBehavior: 'keepMounted',
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
