import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ayu-mirage.css';

export const SchemaEditor: React.FC<{
  defaultCode: string;
  onChange: (v: string) => void;
}> = ({ defaultCode, onChange }) => {
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
        theme: 'ayu-mirage',
        /**
         * Codemirror has a serach addon which can search all the content
         * without render all.
         * But it's search behavior is differnet with popular code editors
         * and the native UX of the browser:
         * https://github.com/codemirror/CodeMirror/issues/4491#issuecomment-284741358
         * So since our schema is not that large, currently we will render
         * all content to support native search.
         */
        viewportMargin: Infinity,
      });
    }
    const handler = (instance: CodeMirror.Editor) => {
      onChange(instance.getValue());
    };
    cm.current.on('change', handler);
    return () => {
      cm.current?.off('change', handler);
    };
  }, [defaultCode]);

  return <Box css={style} ref={wrapperEl} height="100%" width="100%"></Box>;
};
