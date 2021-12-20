import { createTrait } from '../src/trait';

describe('trait', () => {
  it('can create runtime trait', () => {
    expect(
      createTrait({
        version: 'core/v1',
        metadata: {
          name: 'test_trait',
        },

        spec: {
          properties: [{ name: 'width', type: 'number' }],
          state: {
            type: 'string',
          },

          methods: [
            {
              name: 'times',
              parameters: {
                type: 'number',
              },
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "kind": "Trait",
        "metadata": Object {
          "description": "",
          "name": "test_trait",
        },
        "parsedVersion": Object {
          "category": "core",
          "value": "v1",
        },
        "spec": Object {
          "methods": Array [
            Object {
              "name": "times",
              "parameters": Object {
                "type": "number",
              },
            },
          ],
          "properties": Array [
            Object {
              "name": "width",
              "type": "number",
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
