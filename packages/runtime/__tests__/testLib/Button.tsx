import { implementRuntimeComponent } from '../../src/utils/buildKit';
import { Type } from '@sinclair/typebox';

export default implementRuntimeComponent({
  version: 'test/v1',
  metadata: {
    name: 'button',
    displayName: 'Button',
    description: 'for test',
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
    slots: {},
    styleSlots: [],
    events: ['click'],
  },
})(({ callbackMap, component, elementRef }) => {
  const onClick = () => {
    callbackMap?.click?.();
  };

  return (
    <div ref={elementRef}>
      <button onClick={onClick} data-testid={component.id}>
        Test Button
      </button>
    </div>
  );
});
