const path = require("path");
const fs = require("fs");
const ts = require("typescript");

const filename = path.resolve(
  __dirname,
  "../node_modules/@arco-design/web-react/es/index.d.ts"
);

const program = ts.createProgram([filename], {});
const checker = program.getTypeChecker();

function generate({ component, propsNames = [], pick, omit }) {
  if (pick && omit) {
    throw new Error(`pick and omit are both set in "${component}"`);
  }
  propsNames = propsNames.concat(`${component}Props`);
  const props = {};

  /**
   * visit function
   * @param {ts.Node} node
   */
  function visit(node) {
    if (
      (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
      propsNames.includes(node.name.text)
    ) {
      props[node.name.text] = [];
      const type = checker.getTypeAtLocation(node);
      const propertySymbols = checker.getPropertiesOfType(type);
      for (const symbol of propertySymbols) {
        if (pick) {
          if (Array.isArray(pick) && !pick.includes(symbol.name)) {
            continue;
          }
          if (typeof pick === "function" && !pick(symbol.name)) {
            continue;
          }
        }
        if (omit) {
          if (Array.isArray(omit) && omit.includes(symbol.name)) {
            continue;
          }
          if (typeof omit === "function" && omit(symbol.name)) {
            continue;
          }
        }
        const symbolType = checker.getTypeOfSymbolAtLocation(symbol, node);
        const declartion = symbol.declarations[0];
        let nullable = false;
        if (declartion && ts.isPropertySignature(declartion)) {
          nullable = Boolean(declartion.questionToken);
        }
        const typeStr = checker.typeToString(symbolType);
        let value;
        if (typeStr === "boolean") {
          value = `Type.Boolean()`;
        } else if (typeStr === "string") {
          value = `Type.String()`;
        } else if (
          symbolType.isUnion() &&
          symbolType.types.every((t) => t.isStringLiteral())
        ) {
          value = `StringUnion([${symbolType.types
            .map((t) => `'${t.value}'`)
            .join(", ")}])`;
        }
        if (value) {
          props[node.name.text].push({
            name: symbol.name,
            nullable,
            value,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  const sourceFile = program.getSourceFile(
    path.resolve(
      __dirname,
      `../node_modules/@arco-design/web-react/es/${component}/interface.d.ts`
    )
  );
  ts.forEachChild(sourceFile, visit);
  fs.writeFileSync(
    path.resolve(__dirname, `../src/generated/types/${component}.ts`),
    template(props)
  );
}

function template(props) {
  return `
import { Type } from "@sinclair/typebox";
import { IntoStringUnion, StringUnion } from '../../sunmao-helper';

${Object.keys(props)
  .map(
    (name) => `export const ${name}Schema = {
  ${props[name]
    .map(
      (p) =>
        `'${p.name}': ${p.nullable ? "Type.Optional(" : ""}${p.value}${
          p.nullable ? ")" : ""
        }`
    )
    .join(",\r\n  ")}
};`
  )
  .join("\r\n")}
`;
}

[
  {
    component: "Button",
  },
  {
    component: "Layout",
    propsNames: ["HeaderProps", "FooterProps", "ContentProps", "SiderProps"],
    omit(name) {
      return name.startsWith("aria-");
    },
  },
  {
    component: "Image",
  },
  {
    component: "Select",
  },
  {
    component: "Menu",
  },
  {
    component: "Dropdown",
  },
  {
    component: "Space",
  },
  {
    component: "Input",
    pick: [
      "allowClear",
      "disabled",
      "readOnly",
      "defaultValue",
      "placeholder",
      "error",
      "size",
      "showWordLimit",
    ],
  },
  {
    component: "Divider",
  },
  {
    component: "Avatar",
  },
].forEach(generate);
