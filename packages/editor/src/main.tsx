import { css } from '@emotion/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Editor } from './components/Editor';
export default function renderApp() {
  ReactDOM.render(
    <StrictMode>
      <div
        css={css`
          display: flex;
        `}
      >
        <Editor />
      </div>
    </StrictMode>,
    document.getElementById('root')
  );
}

renderApp();
