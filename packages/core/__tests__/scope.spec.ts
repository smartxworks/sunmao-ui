import { createScope } from "../src/scope";

describe("scope", () => {
  it("can create runtime scope", () => {
    expect(
      createScope({
        version: "core/v1",
        metadata: {
          name: "test-scope",
        },
      })
    ).toMatchInlineSnapshot(`
      Object {
        "kind": "Scope",
        "metadata": Object {
          "name": "test-scope",
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
