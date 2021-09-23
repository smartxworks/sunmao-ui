import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@meta-ui/runtime';
import { DialogFormSchema } from './constants';

export default function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <div>Hello, editor</div>
      <App options={DialogFormSchema} />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
