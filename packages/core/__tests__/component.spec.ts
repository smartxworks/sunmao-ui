import { Type } from '@sinclair/typebox';
import { createComponent } from '../src/component';

describe('component', () => {
  it('can create runtime component', () => {
    const c = createComponent({
      version: 'core/v1',
      metadata: {
        isDraggable: true,
        isResizable: true,
        displayName: 'test_component',
        name: 'test_component',
        exampleProperties: {},
        exampleSize: [1, 1],
      },
      spec: {
        properties: Type.Object({
          name: Type.String(),
          type: Type.String(),
        }),
        state: Type.Object({
          type: Type.String(),
        }),
        methods: [
          {
            name: 'reset',
          },
          {
            name: 'add',
            parameters: {
              type: 'number',
            },
          },
        ],
        styleSlots: ['content'],
        slots: [],
        events: [],
      },
    });
    expect(c).toMatchObject({
      ...c,
      kind: 'Component',
      parsedVersion: {
        category: 'core',
        value: 'v1',
      },
    });
  });
});
