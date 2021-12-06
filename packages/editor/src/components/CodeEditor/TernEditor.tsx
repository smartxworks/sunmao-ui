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
// tern
import 'codemirror/addon/tern/tern';
import 'tern/plugin/doc_comment';
import 'tern/plugin/complete_strings';
import ecma from 'tern/defs/ecmascript.json';
import { Def } from 'tern';

function installTern(cm: CodeMirror.Editor) {
  const tern = new CodeMirror.TernServer({ defs: [ecma as unknown as Def] });
  cm.on('cursorActivity', cm => tern.updateArgHints(cm));
  cm.on('change', (_instance, change) => {
    if (change.text.length === 1 && change.text[0] === '.') {
      tern.complete(cm);
    }
  });
  return tern;
}

export const TernEditor: React.FC<{
  defaultCode: string;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
  lineNumbers?: boolean;
}> = ({ defaultCode, onChange, onBlur, lineNumbers = true }) => {
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
        lineNumbers,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        foldOptions: {
          widget: () => {
            return '\u002E\u002E\u002E';
          },
        },
        theme: 'ayu-mirage',
        viewportMargin: Infinity,
      });
      installTern(cm.current);
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
  }, [defaultCode]);

  return <Box css={style} ref={wrapperEl} height="100%" width="100%"></Box>;
};
