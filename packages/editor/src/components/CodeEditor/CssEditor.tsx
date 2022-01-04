import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/css';
import 'codemirror/mode/css/css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';

export const CssEditor: React.FC<{
  defaultCode: string;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
}> = ({ defaultCode, onChange, onBlur }) => {
  const style = css`
    width: 100%;
    .CodeMirror {
      width: 100%;
      height: 120px;
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
          name: 'css',
        },
        foldGutter: true,
        lineWrapping: true,
        lineNumbers: false,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldOptions: {
          widget: () => {
            return '\u002E\u002E\u002E';
          },
        },
        theme: 'ayu-mirage',
      });
    } else {
      cm.current.setValue(defaultCode);
    }
    const changeHandler = (instance: CodeMirror.Editor) => {
      onChange?.(instance.getValue());
    };
    const blurHandler = (instance: CodeMirror.Editor) => {
      onBlur?.(instance.getValue());
    };
    cm.current.on('change', changeHandler);
    cm.current.on('blur', blurHandler);
    return () => {
      cm.current?.off('change', changeHandler);
      cm.current?.off('blur', blurHandler);
    };
  }, [onBlur, onChange, defaultCode]);

  return <Box className={style} ref={wrapperEl}></Box>;
};
