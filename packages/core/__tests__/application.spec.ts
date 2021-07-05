import { createApplication } from "../src/application";

describe("application", () => {
  it("can create runtime application", () => {
    expect(
      createApplication({
        version: "demo/v1",
        metadata: {
          name: "test-app",
          description: "first application",
        },

        spec: {
          components: [
            {
              id: "input1",
              type: "core/v1/test_component",
              properties: {
                x: "foo",
              },

              traits: [
                {
                  type: "core/v1/test_trait",
                  properties: {
                    width: 2,
                  },
                },
              ],
            },
          ],
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "kind": "Application",
        "metadata": Object {
          "description": "first application",
          "name": "test-app",
        },
        "parsedVersion": Object {
          "category": "demo",
          "value": "v1",
        },
        "spec": Object {
          "components": Array [
            Object {
              "id": "input1",
              "parsedType": Object {
                "name": "test_component",
                "version": "core/v1",
              },
              "properties": Object {
                "x": "foo",
              },
              "traits": Array [
                Object {
                  "properties": Object {
                    "width": 2,
                  },
                  "type": "core/v1/test_trait",
                },
              ],
              "type": "core/v1/test_component",
            },
          ],
        },
        "version": "demo/v1",
      }
    `);
  });
});
