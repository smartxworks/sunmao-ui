import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Application,
  createApplication,
  RuntimeApplication,
} from "@meta-ui/core";
import { merge } from "lodash";
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

  const mergeState = useCallback(
    (partial: any) => {
      setStore((cur) => {
        return { [c.id]: { ...cur[c.id], ...partial } };
      });
    },
    [c.id]
  );
  const subscribeMethods = useCallback(
    (map: any) => {
      handlerMap.current = merge(handlerMap.current, map);
    },
    [handlerMap.current]
  );

  // traits
  const traitsProps = {};
  for (const t of c.traits) {
    const tImpl = registry.getTrait(
      t.parsedType.version,
      t.parsedType.name
    ).impl;
    const tProps = tImpl({
      ...t.properties,
      mergeState,
      subscribeMethods,
    });
    merge(traitsProps, tProps);
  }

  return (
    <Impl
      key={c.id}
      {...c.properties}
      {...traitsProps}
      mergeState={mergeState}
      subscribeMethods={subscribeMethods}
    />
  );
};

const DebugStore: React.FC = () => {
  const store = useStore();

  return <pre>{JSON.stringify(store, null, 2)}</pre>;
};

const DebugEvent: React.FC = () => {
  const [events, setEvents] = useState<unknown[]>([]);

  useEffect(() => {
    const handler = (type: string, event: unknown) => {
      setEvents((cur) =>
        cur.concat({ type, event, t: new Date().toLocaleString() })
      );
    };
    emitter.on("*", handler);
    return () => emitter.off("*", handler);
  }, []);

  return (
    <div
      style={{
        padding: "0.5em",
        border: "2px solid black",
        maxHeight: "200px",
        overflow: "auto",
      }}
    >
      {events.map((event, idx) => (
        <pre key={idx}>{JSON.stringify(event)}</pre>
      ))}
    </div>
  );
};

const App: React.FC<{ options: Application }> = ({ options }) => {
  const app = createApplication(options);

  return (
    <div className="App">
      {app.spec.components.map((c) => {
        return <ImplWrapper key={c.id} component={c} />;
      })}
      <DebugStore />
      <DebugEvent />
    </div>
  );
};

export default App;
