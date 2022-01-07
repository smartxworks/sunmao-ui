import { Application } from '@sunmao-ui/core';
import { RuntimeAppSchemaManager } from '../src/services/RuntimeAppSchemaManager';
import { cloneDeep } from 'lodash-es';

const origin: Application = {
  kind: 'Application',
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
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button2',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
        },
        traits: [
          {
            type: 'core/v1/slot',
            properties: { container: { id: 'hstack1', slot: 'content' } },
          },
        ],
      },
      {
        id: 'button3',
        type: 'chakra_ui/v1/button',
        properties: {
          text: { raw: 'text', format: 'plain' },
          colorScheme: 'blue',
          isLoading: false,
        },
        traits: [],
      },
    ],
  },
};

const update: Application = cloneDeep(origin);
update.spec.components = [...origin.spec.components];
update.spec.components[2] = cloneDeep(update.spec.components[2]);
(update.spec.components[2].properties.text as any).raw = '666';

describe('runtime update app schema', () => {
  const manager = new RuntimeAppSchemaManager();
  const s1 = manager.update(origin);
  const s2 = manager.update(update);
  it('keep immutable', () => {
    expect(s1).not.toBe(s2);
    expect(s1.spec.components[0]).toBe(s2.spec.components[0]);
    expect(s1.spec.components[0].parsedType).toEqual({
      name: 'hstack',
      version: 'chakra_ui/v1',
    });
    expect(s1.spec.components[1]).toBe(s2.spec.components[1]);
    expect(s1.spec.components[3]).toBe(s2.spec.components[3]);
    expect(origin.spec.components[2]).not.toBe(update.spec.components[2]);
    expect(s1.spec.components[2]).not.toBe(s2.spec.components[2]);
    expect(s2.spec.components[2].properties.text).toEqual({
      raw: '666',
      format: 'plain',
    });
    expect(s1.spec.components[2].parsedType).toEqual({
      name: 'button',
      version: 'chakra_ui/v1',
    });
  });
});
