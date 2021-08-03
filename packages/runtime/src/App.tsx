import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Application,
  createApplication,
  RuntimeApplication,
} from "@meta-ui/core";
import { merge } from "lodash";
import { registry } from "./registry";
import { setStore, useStore, emitter } from "./store";
import { ContainerPropertySchema } from "./traits/core/slot";
import { Static } from "@sinclair/typebox";

const ImplWrapper = React.forwardRef<
  HTMLDivElement,
  {
    component: RuntimeApplication["spec"]["components"][0];
    slotsMap: SlotsMap | undefined;
  }
>(({ component: c, slotsMap, ...props }, ref) => {
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
  const wrappers: React.FC[] = [];
  for (const t of c.traits) {
    const tImpl = registry.getTrait(
      t.parsedType.version,
      t.parsedType.name
    ).impl;
    const { props: tProps, component: Wrapper } = tImpl({
      ...t.properties,
      mergeState,
      subscribeMethods,
    });
    merge(traitsProps, tProps);
    if (Wrapper) {
      wrappers.push(Wrapper);
    }
  }

  let C = (
    <Impl
      key={c.id}
      {...c.properties}
      {...traitsProps}
      mergeState={mergeState}
      subscribeMethods={subscribeMethods}
      slotsMap={slotsMap}
    />
  );

  while (wrappers.length) {
    const W = wrappers.pop()!;
    C = <W>{C}</W>;
  }

  return (
    <div key={c.id} data-meta-ui-id={c.id} ref={ref} {...props}>
      {C}
      {props.children}
    </div>
  );
});

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

export type ComponentsMap = Map<string, SlotsMap>;
export type SlotsMap = Map<
  string,
  Array<{
    component: React.FC;
    id: string;
  }>
>;
export function resolveNestedComponents(app: RuntimeApplication): {
  topLevelComponents: RuntimeApplication["spec"]["components"];
  componentsMap: ComponentsMap;
} {
  const topLevelComponents: RuntimeApplication["spec"]["components"] = [];
  const componentsMap: ComponentsMap = new Map();

  for (const c of app.spec.components) {
    const slotTrait = c.traits.find((t) => t.parsedType.name === "slot");
    if (slotTrait) {
      const { id, slot } = (
        slotTrait.properties as {
          container: Static<typeof ContainerPropertySchema>;
        }
      ).container;
      if (!componentsMap.has(id)) {
        componentsMap.set(id, new Map());
      }
      if (!componentsMap.get(id)?.has(slot)) {
        componentsMap.get(id)?.set(slot, []);
      }
      componentsMap
        .get(id)
        ?.get(slot)
        ?.push({
          component: React.forwardRef<HTMLDivElement, any>((props, ref) => (
            <ImplWrapper
              component={c}
              slotsMap={componentsMap.get(c.id)}
              {...props}
              ref={ref}
            />
          )),
          id: c.id,
        });
    } else {
      topLevelComponents.push(c);
    }
  }

  return {
    topLevelComponents,
    componentsMap,
  };
}

const App: React.FC<{ options: Application }> = ({ options }) => {
  const app = createApplication(options);
  const { topLevelComponents, componentsMap } = useMemo(
    () => resolveNestedComponents(app),
    [app]
  );

  return (
    <div className="App">
      {topLevelComponents.map((c) => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            slotsMap={componentsMap.get(c.id)}
          />
        );
      })}
      <DebugStore />
      <DebugEvent />
    </div>
  );
};

export default App;
