import { useEffect } from 'react';
import { Kbd as BaseKbd } from '@chakra-ui/react';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent, Text, TextPropertySpec } from '@sunmao-ui/runtime';
import { css } from '@emotion/css';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  text: TextPropertySpec,
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
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: {},
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
