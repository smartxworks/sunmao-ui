import { Divider } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { createComponent } from '@sunmao-ui/core';
import { ComponentImplementation } from '../../services/registry';

const DividerImpl: ComponentImplementation = ({customStyle}) => {
  return <Divider css={css`${customStyle?.content}`} />;
};

export default {
  ...createComponent({
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
      properties: {},
      state: {},
      methods: [],
      slots: [],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: DividerImpl,
};
