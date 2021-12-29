import { Type } from '@sinclair/typebox';
import { parseModuleSchema } from '../src/utils/parseModuleSchema';

describe('parse module schema', () => {
  it('will add module id to the expression', () => {
    expect(
      parseModuleSchema({
        version: 'test/v1',
        kind: 'Module',
        parsedVersion: {
          category: 'test/v1',
          value: 'test',
        },

        metadata: {
          name: 'test',
        },

        spec: {
          properties: {
            value: Type.Object({
              BE_CAREFUL: Type.Number(),
            }),
          },

          events: [],
          stateMap: {},
        },

        impl: [
          {
            id: 'BE_CAREFUL',
            type: 'test/v1/child',
            properties: {
              test: '{{ value.BE_CAREFUL.toFixed(2) }}',
            },

            traits: [],
          },
        ],
      }).impl
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "{{ $moduleId }}__BE_CAREFUL",
          "properties": Object {
            "test": "{{ value.{{ $moduleId }}__BE_CAREFUL.toFixed(2) }}",
          },
          "traits": Array [],
          "type": "test/v1/child",
        },
      ]
    `);
  });
});
