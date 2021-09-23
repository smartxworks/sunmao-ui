import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';

export default function renderApp() {
  ReactDOM.render(
    <StrictMode>
      <div>Hello, editor</div>
      <Editor />
    </StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
