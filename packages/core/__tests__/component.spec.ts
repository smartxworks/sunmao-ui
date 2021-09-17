import { createComponent } from '../src/component';

describe('component', () => {
  it('can create runtime component', () => {
    expect(
      createComponent({
        version: 'core/v1',
        metadata: {
          name: 'test_component',
        },

        spec: {
          properties: [
            {
              name: 'x',
              type: 'string',
            },
          ],

          acceptTraits: [
            {
              name: 't1',
            },
          ],

          state: {
            type: 'string',
          },

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
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "kind": "Component",
        "metadata": Object {
          "name": "test_component",
        },
        "parsedVersion": Object {
          "category": "core",
          "value": "v1",
        },
        "spec": Object {
          "acceptTraits": Array [
            Object {
              "name": "t1",
            },
          ],
          "methods": Array [
            Object {
              "name": "reset",
            },
            Object {
              "name": "add",
              "parameters": Object {
                "type": "number",
              },
            },
          ],
          "properties": Array [
            Object {
              "name": "x",
              "type": "string",
            },
          ],
          "state": Object {
            "type": "string",
          },
        },
        "version": "core/v1",
      }
    `);
  });
});
