import { Type } from '@sinclair/typebox';
import _Text, { TextPropertySchema } from '../_internal/Text';
import { implementRuntimeComponent } from '../../utils/buildKit';

const StateSchema = Type.Object({
  value: Type.String(),
});

const PropsSchema = Type.Object({
  value: TextPropertySchema,
});

export default implementRuntimeComponent({
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
})(({ value, customStyle }) => {
  return <_Text value={value} cssStyle={customStyle?.content} />;
});
