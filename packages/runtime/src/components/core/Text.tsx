import { createComponent } from '@sunmao-ui/core';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImplementation } from 'services/registry';
import _Text, { TextPropertySchema } from '../_internal/Text';

const Text: ComponentImplementation<Static<typeof PropsSchema>> = ({
  value,
  customStyle,
}) => {
  return <_Text value={value} cssStyle={customStyle?.content} />;
};

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  value: TextPropertySchema,
});

export default {
  ...createComponent({
    version: 'core/v1',
    metadata: {
      name: 'text',
      displayName: 'Text',
      description: 'support plain and markdown formats',
      isDraggable: true,
      isResizable: false,
      exampleProperties: {
        value: {
          raw: 'text',
          format: 'plain',
        },
      },
      exampleSize: [4, 1],
    },
    spec: {
      properties: PropsSchema,
      state: StateSchema,
      methods: [],
      slots: [],
      styleSlots: ['content'],
      events: [],
    },
  }),
  impl: Text,
};
