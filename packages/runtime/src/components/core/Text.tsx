import { Type } from '@sinclair/typebox';
import _Text, { TextPropertySpec } from '../_internal/Text';
import { implementRuntimeComponent } from '../../utils/buildKit';
import { CORE_VERSION } from '@sunmao-ui/shared';

const StateSpec = Type.Object({
  value: Type.String(),
});

const PropsSpec = Type.Object({
  value: TextPropertySpec,
});

export default implementRuntimeComponent({
  version: CORE_VERSION,
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
    properties: PropsSpec,
    state: StateSpec,
    methods: {},
    slots: [],
    styleSlots: ['content'],
    events: [],
  },
})(({ value, customStyle, elementRef }) => {
  return <_Text value={value} cssStyle={customStyle?.content} ref={elementRef} />;
});
