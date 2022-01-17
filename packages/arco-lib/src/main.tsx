import renderApp from "@sunmao-ui/editor";
import { components, traits, modules } from "./lib";
import '@sunmao-ui/editor/dist/esm/main.css'

((window as unknown) as { resetApp: Function }).resetApp = () => {
  localStorage.setItem(
    "schema",
    JSON.stringify({
      kind: "Application",
      version: "arco/v1",
      metadata: {
        name: "scf",
      },
      spec: {
        components: [],
      },
    })
  );
};

renderApp({
  components,
  traits,
  modules,
});
