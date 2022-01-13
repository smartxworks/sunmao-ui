import { Type } from '@sinclair/typebox';
import { addModuleId } from '../src/utils/addModuleId';

describe('format to module schema', () => {
  it('will add module id to the expression', () => {
    expect(
      addModuleId({
        version: 'test/v1',
        kind: 'Module',
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
            id: 'input1',
            type: 'test/v1/input',
            properties: {},
            traits: [],
          },
          {
            id: 'BE_CAREFUL',
            type: 'test/v1/child',
            properties: {
              test: '{{ value.BE_CAREFUL.toFixed(2) }}',
              add: '{{ input1.value }} / {{ BE_CAREFUL.value }}'
            },

            traits: [],
          },
        ],
      }).impl
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "{{ $moduleId }}__input1",
          "properties": Object {},
          "traits": Array [],
          "type": "test/v1/input",
        },
        Object {
          "id": "{{ $moduleId }}__BE_CAREFUL",
          "properties": Object {
            "add": "{{ {{ $moduleId }}__input1.value }} / {{ {{ $moduleId }}__BE_CAREFUL.value }}",
            "test": "{{ value.BE_CAREFUL.toFixed(2) }}",
          },
          "traits": Array [],
          "type": "test/v1/child",
        },
      ]
    `);
  });
});
