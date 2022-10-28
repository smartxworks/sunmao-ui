import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Viewer } from './Viewer';

export default function renderApp() {
  ReactDOM.render(
    <StrictMode>
      <Viewer />
    </StrictMode>,
    document.getElementById('root')
  );
}
