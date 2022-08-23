import React, { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/css/css';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/display/autorefresh';
import type { ModeSpec, ModeSpecOptions } from 'codemirror';

// Result
import 'codemirror/mode/javascript/javascript';
import { css, cx } from '@emotion/css';

export const CodeEditor: React.FC<{
  defaultCode: string;
  className?: string;
  mode?: string | ModeSpec<ModeSpecOptions>;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
}> = ({ defaultCode, mode, className, onChange, onBlur }) => {
  const [value, setValue] = useState(defaultCode);
  const style = css`
    .CodeMirror {
      height: 100%;
    }
  `;
  return (
    <CodeMirror
      className={cx([style, className])}
      value={value}
      onChange={(_x, _y, v: string) => {
        setValue(v);
        onChange?.(v);
      }}
      onBlur={() => {
        setValue(value);
        onBlur?.(value);
      }}
      options={{
        mode: mode || 'css',
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
      }}
    />
  );
};
