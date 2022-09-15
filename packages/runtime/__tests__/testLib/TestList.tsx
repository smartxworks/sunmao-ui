import { implementRuntimeComponent } from '../../src/utils/buildKit';
import { Type } from '@sinclair/typebox';
import { PRESET_PROPERTY_CATEGORY } from '@sunmao-ui/shared';
export default implementRuntimeComponent({
  version: 'custom/v1',
  metadata: {
    name: 'testList',
    displayName: 'TestList',
    description: '',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: PRESET_PROPERTY_CATEGORY.Basic,
    },
  },
  spec: {
    properties: Type.Object({
      number: Type.Number(),
    }),
    state: Type.Object({}),
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({
          index: Type.Number(),
        }),
      },
    },
    styleSlots: ['content'],
    events: [],
  },
})(({ number, slotsElements }) => {
  // implement your component here
  return (
    <div>
      {new Array(number)
        .fill(0)
        .map((_, index) => slotsElements?.content?.({ index }, null, `content_${index}`))}
    </div>
  );
});
