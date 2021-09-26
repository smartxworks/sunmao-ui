import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Application,
  createApplication,
  RuntimeApplication,
} from '@meta-ui/core';
import { merge } from 'lodash';
import { Registry, TraitResult } from './registry';
import { stateStore, deepEval } from './store';
import { apiService } from './api-service';
import { ContainerPropertySchema } from './traits/core/slot';
import { Static } from '@sinclair/typebox';
import { watch } from '@vue-reactivity/watch';
import copy from 'copy-to-clipboard';
import { globalHandlerMap } from './handler';
import { initStateAndMethod } from './utils/initStateAndMethod';

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
    app?: RuntimeApplication;
    registry: Registry;
    // [key: string]: any;
  }
>(
  (
    { component: c, slotsMap, targetSlot, app, registry, children, ...props },
    ref
  ) => {
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
        globalHandlerMap.delete(c.id);
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
    const [traitResults, setTraitResults] = useState<TraitResult[]>(() => {
      return c.traits.map(trait =>
        excecuteTrait(trait, deepEval(trait.properties).result)
      );
    });

    function excecuteTrait(
      trait: ApplicationTrait,
      traitProperty: ApplicationTrait['properties']
    ) {
      const tImpl = registry.getTrait(
        trait.parsedType.version,
        trait.parsedType.name
      ).impl;
      return tImpl({
        ...traitProperty,
        componentId: c.id,
        mergeState,
        subscribeMethods,
      });
    }

    // eval traits' properties then excecute traits
    useEffect(() => {
      const stops: ReturnType<typeof watch>[] = [];
      const properties: Array<ApplicationTrait['properties']> = [];
      c.traits.forEach((t, i) => {
        const { result, stop } = deepEval(
          t.properties,
          ({ result: property }) => {
            const traitResult = excecuteTrait(t, property);
            setTraitResults(oldResults => {
              // assume traits number and order will not change
              const newResults = [...oldResults];
              newResults[i] = traitResult;
              return newResults;
            });
            stops.push(stop);
          }
        );
        properties.push(result);
      });
      // although traitResults has initialized in useState, it must be set here again
      // because mergeState will be called during the first render of component, and state will change
      setTraitResults(
        c.traits.map((trait, i) => excecuteTrait(trait, properties[i]))
      );
      return () => stops.forEach(s => s());
    }, [c.traits]);

    // reduce traitResults
    const propsFromTraits: TraitResult['props'] = useMemo(() => {
      return Array.from(traitResults.values()).reduce(
        (prevProps, result: TraitResult) => {
          if (!result.props) {
            return prevProps;
          }

          let effects = prevProps?.effects || [];
          if (result.props?.effects) {
            effects = effects?.concat(result.props?.effects);
          }
          return {
            ...prevProps,
            ...result.props,
            effects,
          };
        },
        {} as TraitResult['props']
      );
    }, [traitResults]);

    // component properties
    const [evaledComponentProperties, setEvaledComponentProperties] = useState(
      () => {
        return merge(deepEval(c.properties).result, propsFromTraits);
      }
    );

    // eval component properties
    useEffect(() => {
      const { result, stop } = deepEval(
        c.properties,
        ({ result: newResult }) => {
          setEvaledComponentProperties({ ...newResult });
        }
      );
      // must keep this line, reason is the same as above
      setEvaledComponentProperties({ ...result });
      return stop;
    }, [c.properties]);

    const mergedProps = { ...evaledComponentProperties, ...propsFromTraits };

    const C = (
      <Impl
        key={c.id}
        component={c}
        {...mergedProps}
        mergeState={mergeState}
        subscribeMethods={subscribeMethods}
        slotsMap={slotsMap}
        app={app}
      />
    );

    if (targetSlot && app) {
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
  }
);

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
          }}
        >
          copy test case
        </button>
      </div>
      <div
        style={{
          padding: '0.5em',
          border: '2px solid black',
          maxHeight: '200px',
          overflow: 'auto',
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

export function resolveAppComponents(
  registry: Registry,
  components: RuntimeApplication['spec']['components'],
  app?: RuntimeApplication
): {
  topLevelComponents: RuntimeApplication['spec']['components'];
  slotComponentsMap: SlotComponentMap;
} {
  const topLevelComponents: RuntimeApplication['spec']['components'] = [];
  const slotComponentsMap: SlotComponentMap = new Map();

  for (const c of components) {
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
          registry={registry}
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

type AppProps = {
  options: Application;
  registry: Registry;
  debugStore?: boolean;
  debugEvent?: boolean;
};

export function genApp(registry: Registry) {
  return (props: Omit<AppProps, 'registry'>) => {
    return <App {...props} registry={registry} />;
  };
}

export const App: React.FC<AppProps> = ({
  options,
  registry,
  debugStore = true,
  debugEvent = true,
}) => {
  const app = createApplication(options);

  initStateAndMethod(registry, app.spec.components);

  const { topLevelComponents, slotComponentsMap } = useMemo(
    () => resolveAppComponents(registry, app.spec.components, app),
    [app]
  );

  return (
    <div className="App">
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            registry={registry}
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
