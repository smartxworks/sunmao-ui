import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import CodeMirror from 'codemirror';
import {
  Box,
  IconButton,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
} from '../UI';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { css, Global } from '@emotion/react';
import { parseExpression } from '@sunmao-ui/runtime';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/mode/multiplex';
import 'codemirror/addon/mode/overlay';
// tern
import 'codemirror/addon/tern/tern';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/display/autorefresh';
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
      change.text
        .concat(change.removed || [])
        .join('')
        .trim() === ''
    ) {
      // do not auto complete when input newline/space
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
      startState: () => ({
        inExpression: false,
      }),
      token: (stream, state) => {
        let ch: string | null = null;
        if (!state.inExpression && stream.match('{{')) {
          state.inExpression = true;
        }
        if (state.inExpression) {
          while ((ch = stream.next()) != null) {
            const next = stream.next();
            if (ch === '}' && next === '}') {
              stream.eat('}');
              state.inExpression = false;
            }
          }
          return 'sunmao-ui';
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

type CommonExpressionEditorProps = {
  defaultCode: string;
  onChange?: (v: string) => void;
  onBlur?: (v: string) => void;
  defs?: tern.Def[];
};
type ExpressionEditorStyleProps = {
  height?: string;
  maxHeight?: string;
  paddingY?: string;
}
type BaseExpressionEditorProps = CommonExpressionEditorProps & ExpressionEditorStyleProps & {
  compact?: boolean;
};
type BaseExpressionEditorHandle = {
  setCode: (code: string) => void;
}

export const BaseExpressionEditor = React.forwardRef<BaseExpressionEditorHandle, BaseExpressionEditorProps>(({
  defaultCode,
  onChange,
  onBlur,
  defs,
  compact,
  height = '100%',
  maxHeight = '',
  paddingY = '2px',
}, ref) => {
  const style = css`
    .CodeMirror {
      width: 100%;
      height: ${height};
      padding: ${paddingY} ${compact ? '8px' : 0};
      border-radius: var(--chakra-radii-sm);
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

    .CodeMirror .CodeMirror-scroll {
      max-height: ${maxHeight};
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
        autoRefresh: { delay: 50 },
        ...(compact
          ? {
              extraKeys: {
                Tab: false
              }
            }
          : {
              lineNumbers: true,
              foldGutter: true,
              gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
              foldOptions: {
                widget: () => {
                  return '\u002E\u002E\u002E';
                },
              },
            }),
      });
      const t = installTern(cm.current);
      tServer.current = t.server;
    }
    const changeHandler = (instance: CodeMirror.Editor) => {
      const value = instance.getValue();

      onChange?.(value);
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
  }, [defaultCode, onChange, onBlur, compact]);
  useEffect(() => {
    if (defs) {
      tServer.current?.deleteDefs('customDataTree');
      tServer.current?.addDefs(defs[0] as any, true);
    }
  }, [defs]);

  useImperativeHandle(ref, () => ({
    setCode: (code: string) => {
      cm.current?.setValue(code);
    }
  }));

  return (
    <Box css={style} ref={wrapperEl} height="100%" width="100%" overflow="hidden">
      <Global
        styles={{
          '.CodeMirror-hints': {
            zIndex: 1800,
          },
        }}
      />
    </Box>
  );
});

export type ExpressionEditorProps = BaseExpressionEditorProps & {
  compactOptions?: ExpressionEditorStyleProps;
};
export type ExpressionEditorHandle = BaseExpressionEditorHandle;


export const ExpressionEditor = React.forwardRef<ExpressionEditorHandle, ExpressionEditorProps>((props: ExpressionEditorProps, ref) => {
  const { compactOptions = {} } = props;
  const style = css`
    .expand-icon {
      display: none;
    }
    &:hover,
    &:focus-within {
      .expand-icon {
        display: inherit;
      }
    }
  `;
  const [showModal, setShowModal] = useState(false);
  const [renderKey, setRenderKey] = useState(0);
  const compactEditorRef = useRef<BaseExpressionEditorHandle>(null);
  const editorRef = useRef<BaseExpressionEditorHandle>(null);

  const onClose = () => {
    setShowModal(false);
    setRenderKey(renderKey + 1);
  };

  useImperativeHandle(ref, () => ({
    setCode: (code: string) => {
      editorRef.current?.setCode(code);
      compactEditorRef.current?.setCode(code);
    }
  }));

  return (
    <Box position="relative" css={style}>
      {/* Force re-render CodeMirror when editted in modal, since it's not reactive */}
      <BaseExpressionEditor ref={compactEditorRef} {...props} key={renderKey} compact {...compactOptions} />
      <IconButton
        aria-label="expand editor"
        position="absolute"
        right="0"
        bottom="0"
        size="xs"
        variant="ghost"
        colorScheme="blue"
        zIndex="9"
        className="expand-icon"
        onClick={() => setShowModal(true)}
      >
        <ExternalLinkIcon />
      </IconButton>
      {showModal && (
        <Modal
          size="xl"
          isOpen
          onClose={onClose}
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Expression Editor</ModalHeader>
            <ModalBody>
              <Box height="500">
                <BaseExpressionEditor ref={editorRef} {...props} compact={false} />
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" colorScheme="blue" onClick={onClose}>
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
});
