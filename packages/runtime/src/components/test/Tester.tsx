import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useEffect } from 'react';

let renderTimes = 1;

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
  useEffect(() => {
    console.log('渲染了');
    renderTimes++;
  });
  return (
    <div>
      <span data-testid={testId}>{renderTimes}</span>
      <span data-testid={`${testId}-text`}>{text}</span>
    </div>
  );
});
