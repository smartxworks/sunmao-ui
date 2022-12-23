import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { initSunmaoUI, RegistryInterface } from '@sunmao-ui/runtime';
import { sunmaoChakraUILib } from '@sunmao-ui/chakra-ui-lib';
import { ArcoDesignLib } from '@sunmao-ui/arco-lib';
import { LocalStorageManager } from './LocalStorageManager';
import '@sunmao-ui/arco-lib/dist/index.css';
import { createModule } from '@sunmao-ui/core';

type Options = Partial<{
  components: Parameters<RegistryInterface['registerComponent']>[0][];
  traits: Parameters<RegistryInterface['registerTrait']>[0][];
  modules: Parameters<RegistryInterface['registerModule']>[0][];
  container: Element;
}>;

const lsManager = new LocalStorageManager();
const { App, registry } = initSunmaoUI({ libs: [sunmaoChakraUILib, ArcoDesignLib] });

export default function renderApp(options: Options = {}) {
  const app = lsManager.getAppFromLS();
  const {
    components = [],
    traits = [],
    modules = lsManager.getModulesFromLS(),
    container = document.getElementById('root'),
  } = options;
  components.forEach(c => registry.registerComponent(c));
  traits.forEach(t => registry.registerTrait(t));
  modules.forEach(m => registry.registerModule(createModule(m)));

  ReactDOM.render(
    <StrictMode>
      <App options={app} debugEvent={false} debugStore={false} />
    </StrictMode>,
    container
  );
}
