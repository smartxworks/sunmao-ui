import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useEffect } from 'react';

export const renderTimesMap: Record<string, number> = {};
export const destroyTimesMap: Record<string, number> = {};

export function clearTesterMap() {
  for (const key in renderTimesMap) {
    delete renderTimesMap[key];
  }
  for (const key in destroyTimesMap) {
    delete destroyTimesMap[key];
  }
}

export default implementRuntimeComponent({
  version: 'test/v1',
  metadata: {
    name: 'tester',
    displayName: 'Tester',
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
    properties: Type.Object({
      text: Type.String(),
    }),
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: [],
    events: [],
  },
})(({ component, elementRef, text }) => {
  const id = component.id;
  renderTimesMap[id] = (renderTimesMap[id] || 0) + 1;

  useEffect(() => {
    return () => {
      destroyTimesMap[id] = (destroyTimesMap[id] || 0) + 1;
    };
  }, [id]);
  return (
    <div ref={elementRef}>
      <p>
        <span>RenderTimes:</span>
        <span data-testid={id}>{renderTimesMap[id] || 0}</span>{' '}
      </p>
      <p>
        <span>DestroyTimes:</span>
        <span data-testid={`${id}-destroy-times`}>{destroyTimesMap[id] || 0}</span>{' '}
      </p>
      <span data-testid={`${id}-text`}>{text}</span>
    </div>
  );
});
