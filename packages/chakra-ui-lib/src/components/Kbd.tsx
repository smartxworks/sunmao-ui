import { useEffect } from 'react';
import { Kbd as BaseKbd } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent, Text, TextPropertySchema } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  text: TextPropertySchema,
});

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'kbd',
    displayName: 'Kbd',
    description: 'chakra-ui keyboard',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {
      text: {
        raw: 'enter',
        format: 'plain',
      },
    },
    exampleSize: [2, 1],
    annotations: {
      category: 'Display',
    },
  },
  spec: {
    properties: PropsSchema,
    state: StateSchema,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(({ text, mergeState, customStyle, elementRef }) => {
  useEffect(() => {
    mergeState({ value: text.raw });
  }, [mergeState, text.raw]);

  return (
    <BaseKbd
      className={css`
        ${customStyle?.content}
      `}
      ref={elementRef}
    >
      <Text value={text} />
    </BaseKbd>
  );
});
