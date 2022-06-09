import { implementRuntimeComponent } from '../../utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useState , useEffect } from 'react';

export default implementRuntimeComponent({
  version: 'test/v1',
  metadata: {
    name: 'input',
    displayName: 'Input',
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
      defaultValue: Type.String(),
    }),
    state: Type.Object({
      value: Type.String(),
    }),
    methods: {},
    slots: {},
    styleSlots: [],
    events: [],
  },
})(({ testId, defaultValue, mergeState }) => {
  const [value, setValue] = useState(defaultValue || '');
  useEffect(() => {
    mergeState({ value });
  });
  return (
    <input data-testid={testId} value={value} onChange={e => setValue(e.target.value)} />
  );
});
