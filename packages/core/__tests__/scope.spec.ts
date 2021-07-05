import { createScope } from "../src/scope";

describe("scope", () => {
  it("can create runtime scope", () => {
    expect(
      createScope({
        version: "core/v1",
        metadata: {
          name: "test_scope",
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "kind": "Scope",
        "metadata": Object {
          "name": "test_scope",
        },
        "parsedVersion": Object {
          "category": "core",
          "value": "v1",
        },
        "version": "core/v1",
      }
    `);
  });
});
