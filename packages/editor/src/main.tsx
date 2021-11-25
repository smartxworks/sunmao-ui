import { ChakraProvider } from '@chakra-ui/react';
import { Application } from '@sunmao-ui/core';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';
import { DefaultAppSchema } from './constants';
import { AppModelManager } from './operations/AppModelManager';
import { apiService, App, ApplicationInstance, registry, stateStore } from './setup';

type Options = Partial<{
  components: Parameters<Registry['registerComponent']>[0][];
  traits: Parameters<Registry['registerTrait']>[0][];
  modules: Parameters<Registry['registerModule']>[0][];
}>;

export default function renderApp(
  app: Application = DefaultAppSchema,
  options: Options = {}
) {
  ApplicationInstance.app = app;
  new AppModelManager(app);

  const { components = [], traits = [], modules = [] } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(m));

  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Editor
          App={App}
          registry={registry}
          stateStore={stateStore}
          apiService={apiService}
        />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}
