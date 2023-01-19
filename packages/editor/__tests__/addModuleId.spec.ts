import { Type } from '@sinclair/typebox';
import {
  addModuleId,
  removeModuleId,
  replaceIdsInProperty,
} from '../src/utils/addModuleId';

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
              add: '{{ input1.value }} / {{ BE_CAREFUL.value }}',
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

  it('will add module id in stateMap', () => {
    expect(
      addModuleId({
        version: 'test/v1',
        kind: 'Module',
        metadata: {
          name: 'test',
        },
        spec: {
          properties: {},
          events: [],
          stateMap: {
            value: 'input1.value',
          },
        },
        impl: [
          {
            id: 'input1',
            type: 'test/v1/input',
            properties: {},
            traits: [],
          },
        ],
      }).spec.stateMap
    ).toEqual({ value: '{{ $moduleId }}__input1.value' });
  });

  it('will remove module id in expression', () => {
    expect(
      removeModuleId({
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
            id: '{{ $moduleId }}__input1',
            type: 'test/v1/input',
            properties: {},
            traits: [],
          },
          {
            id: 'BE_CAREFUL',
            type: 'test/v1/child',
            properties: {
              test: '{{ value.BE_CAREFUL.toFixed(2) }}',
              add: '{{ {{ $moduleId }}__input1.value }} / {{ {{ $moduleId }}__BE_CAREFUL.value }}',
            },

            traits: [],
          },
        ],
      }).impl
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "input1",
          "properties": Object {},
          "traits": Array [],
          "type": "test/v1/input",
        },
        Object {
          "id": "BE_CAREFUL",
          "properties": Object {
            "add": "{{ input1.value }} / {{ BE_CAREFUL.value }}",
            "test": "{{ value.BE_CAREFUL.toFixed(2) }}",
          },
          "traits": Array [],
          "type": "test/v1/child",
        },
      ]
    `);
  });

  it('will remove module id in stateMap', () => {
    expect(
      removeModuleId({
        version: 'test/v1',
        kind: 'Module',
        metadata: {
          name: 'test',
        },
        spec: {
          properties: {},
          events: [],
          stateMap: {
            value: '{{ $moduleId }}__input1.value',
          },
        },
        impl: [
          {
            id: '{{ $moduleId }}__input1',
            type: 'test/v1/input',
            properties: {},
            traits: [],
          },
        ],
      }).spec.stateMap
    ).toEqual({ value: 'input1.value' });
  });
});

describe('test replaceIdsInProperty', () => {
  it('works when there is \n in expression', () => {
    const exp = '{{ \nlicense_type_map.value[license.value.info.licenseType]}}';
    const ids = ['license_type_map'];
    const result = replaceIdsInProperty(exp, ids);
    expect(result).toBe(
      '{{ \n{{ $moduleId }}__license_type_map.value[license.value.info.licenseType]}}'
    );
  });
});
