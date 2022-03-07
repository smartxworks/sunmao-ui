import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/display/autorefresh';

export const Result: React.FC<{
  defaultCode: string;
}> = ({ defaultCode }) => {
  const style = css`
    .CodeMirror {
      width: 100%;
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
        value: defaultCode,
        mode: {
          name: 'javascript',
          json: true,
        },
        foldGutter: true,
        lineWrapping: true,
        lineNumbers: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldOptions: {
          widget: () => {
            return '\u002E\u002E\u002E';
          },
        },
        viewportMargin: Infinity,
        readOnly: true,
        autoRefresh: { delay: 50 },
      });
    }
    setTimeout(() => {
      cm.current?.refresh();
    });
  }, [defaultCode]);

  return <Box className={style} ref={wrapperEl} height="100%" width="100%" />;
};
