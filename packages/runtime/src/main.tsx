import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from '@meta-ui/core';
import { initMetaUI } from './index';
import { ChakraProvider } from '@chakra-ui/react';

const { App, registry: _registry } = initMetaUI();

export default function renderApp(options: Application) {
  ReactDOM.render(
    <React.StrictMode>
      <ChakraProvider>
        <App options={options} />
      </ChakraProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

export const registry = _registry;
