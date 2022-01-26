import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Registry } from '@sunmao-ui/runtime';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
import { ArcoDesignLib } from '@sunmao-ui/arco-lib';
import { EChartsLib } from '@sunmao-ui/echarts-lib';
import { initSunmaoUIEditor } from './init';
import { LocalStorageManager } from './LocalStorageManager';

import './styles.css';

type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
  container: Element;
}>;

const lsManager = new LocalStorageManager();
const { Editor, registry } = initSunmaoUIEditor({
  libs: [sunmaoChakraUILib],
  storageHanlder: {
    onSaveApp(app) {
      lsManager.saveAppInLS(app);
    },
    onSaveModules(modules) {
      lsManager.saveModulesInLS(modules);
    },
  },
  defaultApplication: lsManager.getAppFromLS(),
  defaultModules: lsManager.getModulesFromLS(),
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
  registry.installLib(sunmaoChakraUILib);
  registry.installLib(ArcoDesignLib);
  registry.installLib(EChartsLib);

  ReactDOM.render(
    <StrictMode>
      <Editor />
    </StrictMode>,
    container
  );
}
