import { Divider } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { Type } from '@sinclair/typebox';
import { implementRuntimeComponent } from '@sunmao-ui/runtime';

export default implementRuntimeComponent({
  version: 'chakra_ui/v1',
  metadata: {
    name: 'divider',
    displayName: 'Divider',
    description: 'chakra-ui divider',
    isDraggable: true,
    isResizable: true,
    exampleProperties: {},
    exampleSize: [4, 1],
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(({ customStyle }) => {
  return (
    <Divider
      className={css`
        ${customStyle?.content}
      `}
    />
  );
});
