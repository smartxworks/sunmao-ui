import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { parseExpression } from '@sunmao-ui/runtime';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/addon/mode/overlay';
// tern
import 'codemirror/addon/tern/tern';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/hint/show-hint';
import 'tern/plugin/doc_comment';
import 'tern/plugin/complete_strings';
import ecma from '../../constants/ecmascript';
import tern, { Def } from 'tern';

// TODO: tern uses global variable, maybe there is some workaround
(window as unknown as { tern: typeof tern }).tern = tern;

const checkIfCursorInsideBinding = (editor: CodeMirror.Editor): boolean => {
  let cursorBetweenBinding = false;
  const value = editor.getValue();
  const cursorIndex = getCursorIndex(editor);
  const chunks = parseExpression(value);
  // count of chars processed
  let current = 0;
  chunks.forEach(chunk => {
    if (typeof chunk === 'string') {
      current += chunk.length;
    } else {
      const start = current + '{{'.length;
      const end = start + chunk.join('').length + '}}'.length;
      if (start <= cursorIndex && cursorIndex <= end) {
        cursorBetweenBinding = true;
      }
      current = end;
    }
  });
  return cursorBetweenBinding;
};

const getCursorIndex = (editor: CodeMirror.Editor) => {
  const cursor = editor.getCursor();
  let cursorIndex = cursor.ch;
  if (cursor.line > 0) {
    for (let lineIndex = 0; lineIndex < cursor.line; lineIndex++) {
      const line = editor.getLine(lineIndex);
      cursorIndex = cursorIndex + line.length + 1;
    }
  }
  return cursorIndex;
};

function installTern(cm: CodeMirror.Editor) {
  const t = new CodeMirror.TernServer({ defs: [ecma as unknown as Def] });
  cm.on('cursorActivity', cm => t.updateArgHints(cm));
  cm.on('change', (_instance, change) => {
    if (!checkIfCursorInsideBinding(_instance)) {
      return;
    }
    if (
      // change happened
      change.text.length + (change.removed?.length || 0) > 0 &&
      // not changed by auto-complete
      change.origin !== 'complete'
    ) {
      t.complete(cm);
    }
  });
  return t;
}

CodeMirror.defineMode('text-js', config => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: No types available
  return CodeMirror.multiplexingMode(CodeMirror.getMode(config, 'text/plain'), {
    open: '{{',
    close: '}}',
    mode: CodeMirror.getMode(config, {
      name: 'javascript',
    }),
  });
});

CodeMirror.defineMode('sunmao-ui', (config, parseConfig) => {
  return CodeMirror.overlayMode(
    CodeMirror.getMode(config, parseConfig.backdrop || 'text-js'),
    {
      token: stream => {
        let ch: string | null = null;
        if (stream.match('{{')) {
          while ((ch = stream.next()) != null)
            if (ch === '}' && stream.next() === '}') {
              stream.eat('}');
              return 'sunmao-ui';
            }
        }
        while (stream.next() != null && !stream.match('{{', false)) {
          // loop
        }
        return null;
      },
    },
    true
  );
});

export const ExpressionEditor: React.FC<{
  defaultCode: string;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
  defs?: tern.Def[];
}> = ({ defaultCode, onChange, onBlur, defs }) => {
  const style = css`
    .CodeMirror {
      width: 100%;
      height: 100%;
      padding: 2px var(--chakra-space-2);
      border-radius: var(--chakra-radii-sm);
      border: 2px solid;
      border-color: var(--chakra-colors-transparent);
      background: var(--chakra-colors-gray-100);
      color: var(--chakra-colors-gray-800);
      transition-property: var(--chakra-transition-property-common);
      transition-duration: var(--chakra-transition-duration-normal);
      &:hover {
        background: var(--chakra-colors-gray-200);
      }

      .cm-sunmao-ui {
        background: var(--chakra-colors-green-100);
      }
    }
  `;

  const wrapperEl = useRef<HTMLDivElement>(null);
  const cm = useRef<CodeMirror.Editor | null>(null);
  const tServer = useRef<tern.Server | null>(null);
  useEffect(() => {
    if (!wrapperEl.current) {
      return;
    }
    if (!cm.current) {
      cm.current = CodeMirror(wrapperEl.current, {
        value: defaultCode,
        mode: {
          name: 'sunmao-ui',
        },
        lineWrapping: true,
        theme: 'neat',
        viewportMargin: Infinity,
        hintOptions: {
          completeSingle: false,
        },
      });
      const t = installTern(cm.current);
      tServer.current = t.server;
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
  }, [defaultCode, onChange, onBlur]);
  useEffect(() => {
    if (defs) {
      tServer.current?.deleteDefs('customDataTree');
      tServer.current?.addDefs(defs[0] as any, true);
    }
  }, [defs]);

  return <Box css={style} ref={wrapperEl} height="100%" width="100%" overflow="hidden" />;
};
