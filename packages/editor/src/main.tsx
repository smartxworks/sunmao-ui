import { ChakraProvider } from '@chakra-ui/react';
import { Application } from '@meta-ui/core';
import { initMetaUI } from '@meta-ui/runtime';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';
import { DefaultAppSchema } from './constants';
import { AppModelManager } from './operations/AppModelManager';

export default function renderApp(app: Application = DefaultAppSchema) {
  const metaUI = initMetaUI();

  const App = metaUI.App;
  const registry = metaUI.registry;
  const stateStore = metaUI.stateManager.store;
  const appModelManager = new AppModelManager(app, registry);

  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Editor
          App={App}
          registry={registry}
          stateStore={stateStore}
          appModelManager={appModelManager}
        />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
