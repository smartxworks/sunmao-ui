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
import { stateStore, deepEval } from "./store";
import { apiService } from "./api-service";
import { ContainerPropertySchema } from "./traits/core/slot";
import { RouterIdPropertySchema } from "./traits/core/route";
import { Static } from "@sinclair/typebox";
import { watch } from "@vue-reactivity/watch";
import _ from "lodash";
import copy from "copy-to-clipboard";
import { RouterProvider } from "./components/core/Router";

const ImplWrapper = React.forwardRef<
  HTMLDivElement,
  {
    component: RuntimeApplication["spec"]["components"][0];
    slotsMap: SlotsMap | undefined;
    routerMap: RouterComponentMap | undefined;
    targetSlot: { id: string; slot: string } | null;
    app: RuntimeApplication;
  }
>(({ component: c, slotsMap, routerMap, targetSlot, app, ...props }, ref) => {
  // TODO: find better way to add barrier
  if (!stateStore[c.id]) {
    stateStore[c.id] = {};
  }

  const Impl = registry.getComponent(c.parsedType.version, c.parsedType.name)
    .impl;

  const handlerMap = useRef<Record<string, (parameters?: any) => void>>({});
  useEffect(() => {
    const handler = (s: {
      componentId: string;
      name: string;
      parameters?: any;
    }) => {
      if (s.componentId !== c.id) {
        return;
      }
      if (!handlerMap.current[s.name]) {
        // maybe log?
        return;
      }
      handlerMap.current[s.name](s.parameters);
    };
    apiService.on("uiMethod", handler);
    return () => {
      apiService.off("uiMethod", handler);
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
    const tImpl = registry.getTrait(t.parsedType.version, t.parsedType.name)
      .impl;
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
      routerMap={routerMap}
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
      setEvents((cur) => cur.concat({ type, event, t: new Date() }));
    };
    apiService.on("*", handler);
    return () => apiService.off("*", handler);
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            copy(JSON.stringify(events));
          }}
        >
          copy test case
        </button>
      </div>
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
    </div>
  );
};

export type SlotComponentMap = Map<string, SlotsMap>;
export type SlotsMap = Map<
  string,
  Array<{
    component: React.FC;
    id: string;
  }>
>;

export type RouterComponentsMap = Map<string, RouterComponentMap>;
export type RouterComponentMap = Map<string, React.FC>;

export function resolveAppComponents(
  app: RuntimeApplication
): {
  topLevelComponents: RuntimeApplication["spec"]["components"];
  slotComponentsMap: SlotComponentMap;
  routerComponentsMap: RouterComponentsMap;
  useRouter: boolean;
} {
  const topLevelComponents: RuntimeApplication["spec"]["components"] = [];
  const slotComponentsMap: SlotComponentMap = new Map();
  const routerComponentsMap: RouterComponentsMap = new Map();
  let useRouter = false;

  for (const c of app.spec.components) {
    if (!useRouter && c.parsedType.name === "router") {
      // if any router component was declared, set useRouter to true
      useRouter = true;
    }
    // handle component with slot trait
    const slotTrait = c.traits.find((t) => t.parsedType.name === "slot");
    if (slotTrait) {
      const { id, slot } = (slotTrait.properties as {
        container: Static<typeof ContainerPropertySchema>;
      }).container;
      if (!slotComponentsMap.has(id)) {
        slotComponentsMap.set(id, new Map());
      }
      if (!slotComponentsMap.get(id)?.has(slot)) {
        slotComponentsMap.get(id)?.set(slot, []);
      }
      slotComponentsMap
        .get(id)
        ?.get(slot)
        ?.push({
          component: React.forwardRef<HTMLDivElement, any>((props, ref) => (
            <ImplWrapper
              component={c}
              slotsMap={slotComponentsMap.get(c.id)}
              routerMap={routerComponentsMap.get(c.id)}
              targetSlot={{ id, slot }}
              app={app}
              {...props}
              ref={ref}
            />
          )),
          id: c.id,
        });
    }
    // handle component with route trait
    const routeTrait = c.traits.find((t) => t.parsedType.name === "route");
    if (routeTrait) {
      const { routerId: id } = routeTrait.properties as {
        routerId: Static<typeof RouterIdPropertySchema>;
      };
      if (!routerComponentsMap.has(id)) {
        routerComponentsMap.set(id, new Map());
      }
      routerComponentsMap.get(id)!.set(
        c.id,
        React.forwardRef<HTMLDivElement, any>((props, ref) => (
          <ImplWrapper
            component={c}
            slotsMap={slotComponentsMap.get(c.id)}
            routerMap={routerComponentsMap.get(c.id)}
            app={app}
            {...props}
            ref={ref}
          />
        ))
      );
    }
    // if the component is neither assigned with slot trait nor route trait, consider it as a top level component
    !slotTrait && !routeTrait && topLevelComponents.push(c);
  }

  // if no router component is used, clear routerComponent map;
  if (!useRouter) {
    routerComponentsMap.clear();
  }

  return {
    topLevelComponents,
    slotComponentsMap,
    routerComponentsMap,
    useRouter,
  };
}

const App: React.FC<{
  options: Application;
  debugStore?: boolean;
  debugEvent?: boolean;
}> = ({ options, debugStore = true, debugEvent = true }) => {
  const app = createApplication(options);
  const {
    topLevelComponents,
    slotComponentsMap,
    routerComponentsMap,
    useRouter,
  } = useMemo(() => resolveAppComponents(app), [app]);

  return (
    <div className="App">
      <RouterProvider useRouter={useRouter}>
        {topLevelComponents.map((c) => {
          return (
            <ImplWrapper
              key={c.id}
              component={c}
              slotsMap={slotComponentsMap.get(c.id)}
              routerMap={routerComponentsMap.get(c.id)}
              targetSlot={null}
              app={app}
            />
          );
        })}
      </RouterProvider>
      {debugStore && <DebugStore />}
      {debugEvent && <DebugEvent />}
    </div>
  );
};

export default App;
