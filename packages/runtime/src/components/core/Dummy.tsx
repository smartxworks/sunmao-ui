import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { CORE_VERSION, DUMMY_COMPONENT_NAME } from '@sunmao-ui/shared';

export default implementRuntimeComponent({
  version: CORE_VERSION,
  metadata: {
    name: DUMMY_COMPONENT_NAME,
    displayName: 'Dummy',
    description: 'Dummy Invisible component',
    isDraggable: false,
    isResizable: false,
    exampleProperties: {},
    exampleSize: [1, 1],
    annotations: {
      category: 'Advance',
    },
  },
  spec: {
    properties: Type.Object({}),
    state: Type.Object({}),
    methods: {},
    slots: [],
    styleSlots: [],
    events: [],
  },
})(() => {
  return null;
});
