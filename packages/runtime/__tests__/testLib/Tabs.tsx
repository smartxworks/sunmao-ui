import { implementRuntimeComponent } from '../../src/utils/buildKit';
import { Type } from '@sinclair/typebox';
import { useState, useEffect } from 'react';

export default implementRuntimeComponent({
  version: 'test/v1',
  metadata: {
    name: 'tabs',
    displayName: 'Tabs',
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
      tabNames: Type.Array(Type.String(), {
        title: 'Tab Names',
      }),
      initialSelectedTabIndex: Type.Number({
        title: 'Default Selected Tab Index',
      }),
    }),
    state: Type.Object({
      selectedTabIndex: Type.Number(),
    }),
    methods: {},
    slots: {
      content: {
        slotProps: Type.Object({
          tabIndex: Type.Number(),
        }),
      },
    },
    styleSlots: [],
    events: [],
  },
})(
  ({
    component,
    tabNames,
    mergeState,
    elementRef,
    initialSelectedTabIndex,
    slotsElements,
  }) => {
    const [selectedTabIndex, setSelectedTabIndex] = useState(
      initialSelectedTabIndex ?? 0
    );

    useEffect(() => {
      mergeState({ selectedTabIndex });
    }, [mergeState, selectedTabIndex]);

    return (
      <div ref={elementRef} data-testid={component.id}>
        <div className="tabs">
          {tabNames.map((n, idx) => (
            <div
              key={n}
              data-testid={`${component.id}-tab-${idx}`}
              onClick={() => setSelectedTabIndex(idx)}
            >
              {n}
            </div>
          ))}
        </div>
        <div className="panels">
          {tabNames.map((n, idx) => (
            <div key={n}>{slotsElements?.content?.({ tabIndex: idx })}</div>
          ))}
        </div>
      </div>
    );
  }
);
