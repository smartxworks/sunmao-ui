import { ChakraProvider } from '@chakra-ui/react';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';
import { editorStore } from './EditorStore';
import { App as _App, registry, stateStore } from './setup';

type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
  container: Element;
}>;

export const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Editor App={_App} registry={registry} stateStore={stateStore} />
    </ChakraProvider>
  );
};
export { registry, editorStore, stateStore };

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
  editorStore.appStorage.modules.forEach(m => registry.registerModule(m));

  ReactDOM.render(
    <StrictMode>
      <App />
    </StrictMode>,
    container
  );
}
