import { ChakraProvider } from '@chakra-ui/react';
import { Application, Module } from '@meta-ui/core';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';
import { appModelManager } from './operations/useAppModel';
// import { registry } from './metaUI'

type Example = {
  name: string;
  value: {
    app: Application;
    modules?: Module[];
  };
};

export default function renderPlayground(examples: Example[]) {
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Editor />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}
