import React, { useEffect, useRef, useState } from 'react';
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
  needRerenderAfterMount?: boolean;
  readOnly?: boolean;
}> = ({
  defaultCode,
  mode,
  needRerenderAfterMount,
  className,
  onChange,
  onBlur,
  readOnly,
}) => {
  const valueRef = useRef(defaultCode);
  const [rerenderFlag, setRerenderFlag] = useState(0);
  const style = css`
    .CodeMirror {
      height: 100%;
    }
  `;

  // StyleTraitForm has animation which will affect the position calculation of CodeMirror.
  // So it need a force rerender to correct the position of CodeMirror after mount.
  useEffect(() => {
    if (needRerenderAfterMount) {
      requestIdleCallback(() => {
        setRerenderFlag(1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CodeMirror
      key={rerenderFlag}
      className={cx([style, className])}
      value={defaultCode}
      onChange={(_x, _y, v: string) => {
        valueRef.current = v;
        onChange?.(v);
      }}
      onBlur={() => {
        onBlur?.(valueRef.current);
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
        readOnly,
      }}
    />
  );
};
