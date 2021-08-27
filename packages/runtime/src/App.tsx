import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Application,
  ComponentTrait,
  createApplication,
  RuntimeApplication,
  Trait,
} from '@meta-ui/core';
import { merge } from 'lodash';
import { registry, TraitResult } from './registry';
import { stateStore, deepEval } from './store';
import { apiService } from './api-service';
import { ContainerPropertySchema } from './traits/core/slot';
import { Static } from '@sinclair/typebox';
import { watch } from '@vue-reactivity/watch';
import _ from 'lodash';
import copy from 'copy-to-clipboard';
import { globalHandlerMap } from './handler';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type ApplicationComponent = RuntimeApplication['spec']['components'][0];
type ApplicationTrait = ArrayElement<ApplicationComponent['traits']>;

export const ImplWrapper = React.forwardRef<
  HTMLDivElement,
  {
    component: ApplicationComponent;
    slotsMap: SlotsMap | undefined;
    targetSlot: { id: string; slot: string } | null;
    app: RuntimeApplication;
    [key: string]: any;
  }
>(({ component: c, slotsMap, targetSlot, app, children, ...props }, ref) => {
  // TODO: find better way to add barrier
  if (!stateStore[c.id]) {
    stateStore[c.id] = {};
  }

  const Impl = registry.getComponent(
    c.parsedType.version,
    c.parsedType.name
  ).impl;

  if (!globalHandlerMap.has(c.id)) {
    globalHandlerMap.set(c.id, {});
  }

  let handlerMap = globalHandlerMap.get(c.id)!;
  useEffect(() => {
    const handler = (s: {
      componentId: string;
      name: string;
      parameters?: any;
    }) => {
      if (s.componentId !== c.id) {
        return;
      }
      if (!handlerMap[s.name]) {
        // maybe log?
        return;
      }
      handlerMap[s.name](s.parameters);
    };
    apiService.on('uiMethod', handler);
    return () => {
      apiService.off('uiMethod', handler);
    };
  }, []);

  const mergeState = useCallback(
    (partial: any) => {
      stateStore[c.id] = { ...stateStore[c.id], ...partial };
    },
    [c.id]
  );
  const subscribeMethods = useCallback((map: any) => {
    handlerMap = { ...handlerMap, ...map };
    globalHandlerMap.set(c.id, handlerMap);
  }, []);

  // result returned from traits
  const [traitResults, setTraitResults] = useState<TraitResult[]>([]);

  // eval traits' properties then excecute traits
  useEffect(() => {
    function excecuteTrait(
      trait: ApplicationTrait,
      traitProperty: ApplicationTrait['properties']
    ) {
      const tImpl = registry.getTrait(
        trait.parsedType.version,
        trait.parsedType.name
      ).impl;
      const traitResult = tImpl({
        ...traitProperty,
        componentId: c.id,
        mergeState,
        subscribeMethods,
      });
      setTraitResults(results => results.concat(traitResult));
    }

    const stops: ReturnType<typeof watch>[] = [];
    for (const t of c.traits) {
      const { stop, result } = deepEval(t.properties, ({ result }) => {
        excecuteTrait(t, { ...result });
      });
      excecuteTrait(t, { ...result });
      stops.push(stop);
    }
    return () => stops.forEach(s => s());
  }, [c.traits]);

  // reduce traitResults
  const propsFromTraits: TraitResult = useMemo(() => {
    return Array.from(traitResults.values()).reduce(
      (prevProps, result: TraitResult) => {
        return { ...prevProps, ...result.props };
      },
      { props: null }
    );
  }, [traitResults]);

  // component properties
  const [evaledComponentProperties, setEvaledComponentProperties] = useState(
    merge(deepEval(c.properties).result, propsFromTraits)
  );

  // eval component properties
  useEffect(() => {
    const { stop, result } = deepEval(c.properties, ({ result }) => {
      setEvaledComponentProperties({ ...result });
    });

    setEvaledComponentProperties(result);
    return stop;
  }, []);

  const mergedProps = { ...evaledComponentProperties, ...propsFromTraits };

  let C = (
    <Impl
      key={c.id}
      {...mergedProps}
      mergeState={mergeState}
      subscribeMethods={subscribeMethods}
      slotsMap={slotsMap}
    />
  );

  if (targetSlot) {
    const targetC = app.spec.components.find(c => c.id === targetSlot.id);
    if (targetC?.parsedType.name === 'grid_layout') {
      return (
        <div key={c.id} data-meta-ui-id={c.id} ref={ref} {...props}>
          {C}
          {children}
        </div>
      );
    }
  }

  return (
    <React.Fragment key={c.id}>
      {C}
      {children}
    </React.Fragment>
  );
});

const DebugStore: React.FC = () => {
  const [store, setStore] = useState(stateStore);
  useEffect(() => {
    setStore({ ...stateStore });
    watch(stateStore, newValue => {
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
      setEvents(cur => cur.concat({ type, event, t: new Date() }));
    };
    apiService.on('*', handler);
    return () => apiService.off('*', handler);
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            copy(JSON.stringify(events));
          }}>
          copy test case
        </button>
      </div>
      <div
        style={{
          padding: '0.5em',
          border: '2px solid black',
          maxHeight: '200px',
          overflow: 'auto',
        }}>
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

export function resolveAppComponents(app: RuntimeApplication): {
  topLevelComponents: RuntimeApplication['spec']['components'];
  slotComponentsMap: SlotComponentMap;
} {
  const topLevelComponents: RuntimeApplication['spec']['components'] = [];
  const slotComponentsMap: SlotComponentMap = new Map();

  for (const c of app.spec.components) {
    // handle component with slot trait
    const slotTrait = c.traits.find(t => t.parsedType.name === 'slot');
    if (slotTrait) {
      const { id, slot } = (
        slotTrait.properties as {
          container: Static<typeof ContainerPropertySchema>;
        }
      ).container;
      if (!slotComponentsMap.has(id)) {
        slotComponentsMap.set(id, new Map());
      }
      if (!slotComponentsMap.get(id)?.has(slot)) {
        slotComponentsMap.get(id)?.set(slot, []);
      }
      const component = React.forwardRef<HTMLDivElement, any>((props, ref) => (
        <ImplWrapper
          component={c}
          slotsMap={slotComponentsMap.get(c.id)}
          targetSlot={{ id, slot }}
          app={app}
          {...props}
          ref={ref}
        />
      ));
      component.displayName = c.parsedType.name;
      slotComponentsMap.get(id)?.get(slot)?.push({
        component,
        id: c.id,
      });
    }

    // if the component is neither assigned with slot trait nor route trait, consider it as a top level component
    !slotTrait && topLevelComponents.push(c);
  }

  return {
    topLevelComponents,
    slotComponentsMap,
  };
}

const App: React.FC<{
  options: Application;
  debugStore?: boolean;
  debugEvent?: boolean;
}> = ({ options, debugStore = true, debugEvent = true }) => {
  const app = createApplication(options);
  const { topLevelComponents, slotComponentsMap } = useMemo(
    () => resolveAppComponents(app),
    [app]
  );

  return (
    <div className="App">
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            slotsMap={slotComponentsMap.get(c.id)}
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
