import { initSunmaoUI } from "@sunmao-ui/runtime";
import ReactDOM from "react-dom";
import { install } from "./lib";

const { App, registry } = initSunmaoUI();

install(registry);

ReactDOM.render(
  <App
    options={{
      kind: "Application",
      version: "arco/v1",
      metadata: {
        name: "playground",
      },
      spec: {
        components: [
          {
            id: "button_1",
            type: "arco/v1/button",
            properties: {
              type: "primary",
            },
            traits: [],
          },
          {
            id: "text_1",
            type: "core/v1/text",
            properties: {
              value: {
                raw: "hello button",
                format: "plain",
              },
            },
            traits: [
              {
                type: "core/v1/slot",
                properties: {
                  container: {
                    id: "button_1",
                    slot: "content",
                  },
                },
              },
            ],
          },
        ],
      },
    }}
  />,
  document.getElementById("root")
);
