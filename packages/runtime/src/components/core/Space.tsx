import { Type } from '@sinclair/typebox';
import _Space, { SpacePropertySchema } from '../_internal/Space';
import { implementRuntimeComponent } from '../../utils/buildKit';

const StateSchema = Type.Object({});

export default implementRuntimeComponent({
  version: 'core/v1',
  metadata: {
    name: 'space',
    displayName: 'Space',
    description: '',
    isDraggable: true,
    isResizable: false,
    exampleProperties: {
      size: 'small',
      direction: 'horizontal',
      align: 'start',
      wrap: '',
      justifyContent:''
    },
    exampleSize: [4, 1],
    annotations: {
      category: 'Layout',
    },
  },
  spec: {
    properties: SpacePropertySchema,
    state: StateSchema,
    methods: {},
    slots: ['content'],
    styleSlots: ['content'],
    events: [],
  },
})(({ customStyle, elementRef, slotsElements, ...restProps }) => {
  return (
    <_Space cssStyle={customStyle?.content} ref={elementRef} {...restProps}>
      {slotsElements.content}
    </_Space>
  );
});
