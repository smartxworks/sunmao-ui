import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import { Box } from '@chakra-ui/react';
import { css } from '@emotion/react';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldgutter';
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

function installTern(cm: CodeMirror.Editor) {
  const t = new CodeMirror.TernServer({ defs: [ecma as unknown as Def] });
  cm.on('cursorActivity', cm => t.updateArgHints(cm));
  cm.on('change', (_instance, change) => {
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

export const ExpressionEditor: React.FC<{
  defaultCode: string;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
  lineNumbers?: boolean;
  defs?: tern.Def[];
}> = ({ defaultCode, onChange, onBlur, lineNumbers, defs }) => {
  const style = css`
    .CodeMirror {
      width: 100%;
      height: 100%;
      padding: 2px 0;
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
  }, [defaultCode, lineNumbers, onChange, onBlur]);
  useEffect(() => {
    if (defs) {
      tServer.current?.deleteDefs('customDataTree');
      tServer.current?.addDefs(defs[0] as any, true);
    }
  }, [defs]);

  return (
    <Box
      css={style}
      ref={wrapperEl}
      height="100%"
      width="100%"
      borderRadius="2"
      overflow="hidden"
    />
  );
};
