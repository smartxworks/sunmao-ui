import React from "react";
import {
  Application,
  createApplication,
  RuntimeApplication,
} from "@meta-ui/core";
import { registry } from "./registry";
import { setStore, useStore } from "./store";

const ImplWrapper: React.FC<{
  component: RuntimeApplication["spec"]["components"][0];
}> = ({ component: c }) => {
  const Impl = registry.getComponent(
    c.parsedType.version,
    c.parsedType.name
  ).impl;

  return (
    <Impl
      key={c.id}
      {...c.properties}
      mergeState={(partial: any) => setStore({ [c.id]: partial })}
    />
  );
};

const DebugStore: React.FC = () => {
  const store = useStore();

  return <pre>{JSON.stringify(store, null, 2)}</pre>;
};

const App: React.FC<{ options: Application }> = ({ options }) => {
  const app = createApplication(options);

  return (
    <div className="App">
      <DebugStore />
      {app.spec.components.map((c) => {
        return <ImplWrapper key={c.id} component={c} />;
      })}
    </div>
  );
};

export default App;
