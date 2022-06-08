import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useEffect } from 'react';

(window as any).renderTimesMap = {};
(window as any).destroyTimesMap = {};
const renderTimesMap = (window as any).renderTimesMap;
const destroyTimesMap = (window as any).destroyTimesMap;

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
      testId: Type.String(),
      text: Type.String(),
    }),
    state: Type.Object({}),
    methods: {},
    slots: {},
    styleSlots: [],
    events: [],
  },
})(({ testId, text }) => {
  renderTimesMap[testId] = (renderTimesMap[testId] || 0) + 1;

  useEffect(() => {
    return () => {
      destroyTimesMap[testId] = (destroyTimesMap[testId] || 0) + 1;
    };
  }, [testId]);
  return (
    <div>
      <p>
        <span>RenderTimes:</span>
        <span data-testid={testId}>{renderTimesMap[testId] || 0}</span>{' '}
      </p>
      <p>
        <span>DestroyTimes:</span>
        <span data-testid={`${testId}-destroy`}>{destroyTimesMap[testId] || 0}</span>{' '}
      </p>
      <span data-testid={`${testId}-text`}>{text}</span>
    </div>
  );
});
