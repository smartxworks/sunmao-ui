import React from 'react';
import ReactDOM from 'react-dom';

export default function renderApp() {
  ReactDOM.render(
    <React.StrictMode>
      <div>Hello, editor</div>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
