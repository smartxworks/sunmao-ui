import { createComponent } from '@meta-ui/core';
import { Type, Static } from '@sinclair/typebox';
import { ComponentImplementation } from '../../services/registry';
import _Text, { TextPropertySchema } from '../_internal/Text';

const Text: ComponentImplementation<Static<typeof PropsSchema>> = ({ value, style }) => {
  return <_Text value={value} style={style} />;
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
      defaultProperties: {
        raw: 'text',
        format: 'plain',
      },
    },
    spec: {
      properties: PropsSchema,
      acceptTraits: [],
      state: StateSchema,
      methods: [],
    },
  }),
  impl: Text,
};
