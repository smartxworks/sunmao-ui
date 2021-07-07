import React, { useEffect, useRef } from "react";
import {
  Application,
  createApplication,
  RuntimeApplication,
} from "@meta-ui/core";
import { registry } from "./registry";
import { setStore, useStore, emitter } from "./store";

const ImplWrapper: React.FC<{
  component: RuntimeApplication["spec"]["components"][0];
}> = ({ component: c }) => {
  const Impl = registry.getComponent(
    c.parsedType.version,
    c.parsedType.name
  ).impl;

  const handlerMap = useRef<Record<string, (parameters?: any) => void>>({});
  useEffect(() => {
    const handler = (s: { name: string; parameters?: any }) => {
      if (!handlerMap.current[s.name]) {
        // maybe log?
        return;
      }
      handlerMap.current[s.name](s.parameters);
    };
    emitter.on(c.id, handler);
    return () => {
      emitter.off(c.id, handler);
    };
  }, []);

  return (
    <Impl
      key={c.id}
      {...c.properties}
      mergeState={(partial: any) => setStore({ [c.id]: partial })}
      subscribeMethods={(map: any) => {
        handlerMap.current = map;
      }}
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
