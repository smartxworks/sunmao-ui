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
import { emitter, stateStore, deepEval } from "./store";
import { ContainerPropertySchema } from "./traits/core/slot";
import { Static } from "@sinclair/typebox";
import { watch } from "@vue-reactivity/watch";
import _ from "lodash";

const ImplWrapper = React.forwardRef<
  HTMLDivElement,
  {
    component: RuntimeApplication["spec"]["components"][0];
    slotsMap: SlotsMap | undefined;
    targetSlot: { id: string; slot: string } | null;
    app: RuntimeApplication;
  }
>(({ component: c, slotsMap, targetSlot, app, ...props }, ref) => {
  // TODO: find better way to add barrier
  if (!stateStore[c.id]) {
    stateStore[c.id] = {};
  }

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
      stateStore[c.id] = { ...stateStore[c.id], ...partial };
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
  const [traitPropertiesMap, setTraitPropertiesMap] = useState<
    Map<typeof c["traits"][0], object>
  >(
    c.traits.reduce((prev, cur) => {
      prev.set(cur, deepEval(cur.properties).result);
      return prev;
    }, new Map())
  );
  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    for (const t of c.traits) {
      const { stop, result } = deepEval(t.properties, ({ result }) => {
        setTraitPropertiesMap(
          new Map(traitPropertiesMap.set(t, { ...result }))
        );
      });
      setTraitPropertiesMap(new Map(traitPropertiesMap.set(t, { ...result })));
      stops.push(stop);
    }
    return () => stops.forEach((s) => s());
  }, []);

  const traitsProps = {};
  const wrappers: React.FC[] = [];
  for (const t of c.traits) {
    const tImpl = registry.getTrait(
      t.parsedType.version,
      t.parsedType.name
    ).impl;
    const { props: tProps, component: Wrapper } = tImpl({
      ...traitPropertiesMap.get(t),
      mergeState,
      subscribeMethods,
    });
    merge(traitsProps, tProps);
    if (Wrapper) {
      wrappers.push(Wrapper);
    }
  }

  const [mergedProps, setMergedProps] = useState(
    deepEval({
      ...c.properties,
      ...traitsProps,
    }).result
  );
  useEffect(() => {
    const rawProps: Record<string, unknown> = {
      ...c.properties,
      ...traitsProps,
    };

    const { stop, result } = deepEval(rawProps, ({ result }) => {
      setMergedProps({ ...result });
    });

    setMergedProps({ ...result });
    return stop;
  }, []);

  let C = (
    <Impl
      key={c.id}
      {...mergedProps}
      mergeState={mergeState}
      subscribeMethods={subscribeMethods}
      slotsMap={slotsMap}
    />
  );

  while (wrappers.length) {
    const W = wrappers.pop()!;
    C = <W>{C}</W>;
  }

  if (targetSlot) {
    const targetC = app.spec.components.find((c) => c.id === targetSlot.id);
    if (targetC?.parsedType.name === "grid_layout") {
      return (
        <div key={c.id} data-meta-ui-id={c.id} ref={ref} {...props}>
          {C}
          {props.children}
        </div>
      );
    }
  }

  return (
    <React.Fragment key={c.id}>
      {C}
      {props.children}
    </React.Fragment>
  );
});

const DebugStore: React.FC = () => {
  const [store, setStore] = useState(stateStore);
  useEffect(() => {
    setStore({ ...stateStore });
    watch(stateStore, (newValue) => {
      setTimeout(() => {
        setStore({ ...newValue });
      }, 0);
    });
  }, []);

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
              targetSlot={{ id, slot }}
              app={app}
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

const App: React.FC<{
  options: Application;
  debugStore?: boolean;
  debugEvent?: boolean;
}> = ({ options, debugStore = true, debugEvent = true }) => {
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
            targetSlot={null}
            app={app}
          />
        );
      })}
      {debugStore && <DebugStore />}
      {debugEvent && <DebugEvent />}
    </div>
  );
};

export default App;
