import { useEffect, useRef } from 'react';
import { Type } from '@sinclair/typebox';
import Text, { TextPropertySchema } from '../_internal/Text';
import { implementRuntimeComponent2 } from '../../utils/buildKit';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
});

export default implementRuntimeComponent2({
  version: 'plain/v1',
  metadata: {
    name: 'button',
    displayName: 'Button',
    description: 'plain button',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      text: {
        raw: 'text',
        format: 'plain',
      },
    },
    exampleSize: [2, 1],
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {
      click: void 0,
    },
    slots: [],
    styleSlots: ['content'],
    events: ['onClick'],
  },
})(({ text, mergeState, subscribeMethods, callbackMap, customStyle }) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [mergeState, text.raw]);

  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    subscribeMethods({
      click() {
        ref.current?.click();
      },
    });
  }, [subscribeMethods]);

  return (
    <button
      ref={ref}
      onClick={callbackMap?.onClick}
      className={`${customStyle?.content}`}
    >
      <Text value={text} />
    </button>
  );
});
