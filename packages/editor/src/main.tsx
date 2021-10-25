import { ChakraProvider } from '@chakra-ui/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';

export default function renderApp() {
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Editor />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
