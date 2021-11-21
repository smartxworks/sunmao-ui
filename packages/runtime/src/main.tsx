import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from '@sunmao-ui/core';
import { initSunmaoUI } from './index';
import { ChakraProvider } from '@chakra-ui/react';

const { App, registry: _registry } = initSunmaoUI();

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
