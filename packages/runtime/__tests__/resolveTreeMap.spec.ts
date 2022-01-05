import { createApplication } from '@sunmao-ui/core';
import { resolveTreeMap } from '../src/utils/resolveTreeMap';

const origin = createApplication({
  version: 'example/v1',
  metadata: { name: 'dialog_component', description: 'dialog component example' },
  spec: {
    components: [
      {
        id: 'hstack1',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
      {
        id: 'button1',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'vstack1',
        type: 'chakra_ui/v1/vstack',
        properties: { spacing: '24px' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'hstack2',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'vstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text1',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'text2',
        type: 'core/v1/text',
        properties: { value: { raw: 'text', format: 'plain' } },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack2', slot: 'content' } },
          },
        ],
      },
      {
        id: 'hstack3',
        type: 'chakra_ui/v1/hstack',
        properties: { spacing: '24px' },
        traits: [],
      },
    ],
  },
});

describe('resolve tree map', () => {
  const {treeMap, topLevelComponents} = resolveTreeMap(origin.spec.components)
  it('resolve tree map', () => {
    expect(treeMap['hstack1'].content.map(c => c.id)).toEqual(['button1', 'vstack1']);
    expect(treeMap['vstack1'].content.map(c => c.id)).toEqual(['hstack2']);
    expect(treeMap['hstack2'].content.map(c => c.id)).toEqual(['text1', 'text2']);
    expect(topLevelComponents.map(c => c.id)).toEqual(['hstack1', 'hstack3']);

  });
});
