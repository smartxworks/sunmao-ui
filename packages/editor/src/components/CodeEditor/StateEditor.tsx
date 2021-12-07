import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/lib/codemirror.css';
import ErrorBoundary from '../ErrorBoundary';

export const StateEditor: React.FC<{ code: string }> = ({ code }) => {
  const style = css`
    .CodeMirror {
      height: 100%;
    }
  `;

  const wrapperEl = useRef<HTMLDivElement>(null);
  const cm = useRef<CodeMirror.Editor | null>(null);
  useEffect(() => {
    if (!wrapperEl.current) {
      return;
    }
    if (!cm.current) {
      cm.current = CodeMirror(wrapperEl.current, {
        value: code,
        mode: {
          name: 'javascript',
          json: true,
        },
        readOnly: true,
        foldGutter: true,
        lineWrapping: true,
        lineNumbers: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldOptions: {
          widget: () => {
            return '\u002E\u002E\u002E';
          },
        },
      });
    } else {
      cm.current.setValue(code);
    }
  }, [code]);

  return (
    <ErrorBoundary>
      {' '}
      <Box css={style} ref={wrapperEl} height="100%"></Box>
    </ErrorBoundary>
  );
};
