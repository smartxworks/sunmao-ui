import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from '@meta-ui/core';
import { InitMetaUI } from './index';

const { App } = InitMetaUI();

export default function renderApp(options: Application) {
  ReactDOM.render(
    <React.StrictMode>
      <App options={options} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
