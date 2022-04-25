import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { merge } from 'lodash-es';
import { RuntimeComponentSchema, RuntimeTraitSchema } from '@sunmao-ui/core';
import { watch } from '../../utils/watchReactivity';
import { ImplWrapperProps, TraitResult } from '../../types';
import { shallowCompareArray, CORE_VERSION, SLOT_TRAIT_NAME } from '@sunmao-ui/shared';

const _ImplWrapper = React.forwardRef<HTMLDivElement, ImplWrapperProps>((props, ref) => {
  const { component: c, app, children, services, childrenMap, hooks, isInModule } = props;
  const { registry, stateManager, globalHandlerMap, apiService, eleMap } = props.services;
  const childrenCache = new Map<RuntimeComponentSchema, React.ReactElement>();

  const Impl = registry.getComponent(c.parsedType.version, c.parsedType.name).impl;

  if (!globalHandlerMap.has(c.id)) {
    globalHandlerMap.set(c.id, {});
  }

  const handlerMap = useRef(globalHandlerMap.get(c.id)!);
  const eleRef = useRef<HTMLElement>();
  const onRef = (ele: HTMLElement) => {
    // If a component is in module, it should not have mask, so we needn't set it
    if (!isInModule) {
      eleMap.set(c.id, ele);
    }
    hooks?.didDomUpdate && hooks?.didDomUpdate();
  };

  useEffect(() => {
    // If a component is in module, it should not have mask, so we needn't set it
    if (eleRef.current && !isInModule) {
      eleMap.set(c.id, eleRef.current);
    }
    return () => {
      if (!isInModule) {
        eleMap.delete(c.id);
      }
    };
  }, [c.id, eleMap, isInModule]);

  useEffect(() => {
    const handler = (s: { componentId: string; name: string; parameters?: any }) => {
      if (s.componentId !== c.id) {
        return;
      }
      if (!handlerMap.current[s.name]) {
        // maybe log?
        return;
      }
      handlerMap.current[s.name](s.parameters);
    };
    apiService.on('uiMethod', handler);
    return () => {
      apiService.off('uiMethod', handler);
      globalHandlerMap.delete(c.id);
    };
  }, [apiService, c.id, globalHandlerMap, handlerMap]);

  const mergeState = useCallback(
    (partial: any) => {
      stateManager.store[c.id] = { ...stateManager.store[c.id], ...partial };
    },
    [c.id, stateManager.store]
  );
  const subscribeMethods = useCallback(
    (map: any) => {
      handlerMap.current = { ...handlerMap.current, ...map };
      globalHandlerMap.set(c.id, handlerMap.current);
    },
    [c.id, globalHandlerMap]
  );

  const executeTrait = useCallback(
    (trait: RuntimeTraitSchema, traitProperty: RuntimeTraitSchema['properties']) => {
      const tImpl = registry.getTrait(
        trait.parsedType.version,
        trait.parsedType.name
      ).impl;
      return tImpl({
        ...traitProperty,
        trait,
        componentId: c.id,
        mergeState,
        subscribeMethods,
        services,
      });
    },
    [c.id, mergeState, registry, services, subscribeMethods]
  );

  // result returned from traits
  const [traitResults, setTraitResults] = useState<TraitResult<string, string>[]>([]);

  // eval traits' properties then execute traits
  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    const properties: Array<RuntimeTraitSchema['properties']> = [];
    c.traits.forEach((t, i) => {
      const { result, stop } = stateManager.deepEvalAndWatch(
        t.properties,
        ({ result: property }: any) => {
          const traitResult = executeTrait(t, property);
          setTraitResults(oldResults => {
            // assume traits number and order will not change
            const newResults = [...oldResults];
            newResults[i] = traitResult;
            return newResults;
          });
          stops.push(stop);
        },
        { fallbackWhenError: () => undefined }
      );
      properties.push(result);
    });
    // although traitResults has initialized in useState, it must be set here again
    // because mergeState will be called during the first render of component, and state will change
    setTraitResults(c.traits.map((trait, i) => executeTrait(trait, properties[i])));
    return () => stops.forEach(s => s());
  }, [c.traits, executeTrait, stateManager]);

  // reduce traitResults
  const propsFromTraits: TraitResult<string, string>['props'] = useMemo(() => {
    return Array.from(traitResults.values()).reduce(
      (prevProps, result: TraitResult<string, string>) => {
        if (!result.props) {
          return prevProps;
        }

        let effects = prevProps?.effects || [];
        if (result.props?.effects) {
          effects = effects?.concat(result.props?.effects);
        }

        return merge(prevProps, result.props, { effects });
      },
      {} as TraitResult<string, string>['props']
    );
  }, [traitResults]);
  const unmount = traitResults.some(r => r.unmount);

  // component properties
  const [evaledComponentProperties, setEvaledComponentProperties] = useState(() => {
    return merge(
      stateManager.deepEval(c.properties, { fallbackWhenError: () => undefined }),
      propsFromTraits
    );
  });
  // eval component properties
  useEffect(() => {
    const { result, stop } = stateManager.deepEvalAndWatch(
      c.properties,
      ({ result: newResult }: any) => {
        setEvaledComponentProperties({ ...newResult });
      },
      { fallbackWhenError: () => undefined }
    );
    // must keep this line, reason is the same as above
    setEvaledComponentProperties({ ...result });

    return stop;
  }, [c.properties, stateManager]);
  useEffect(() => {
    if (unmount) {
      delete stateManager.store[c.id];
    }
    return () => {
      delete stateManager.store[c.id];
    };
  }, [c.id, stateManager.store, unmount]);
  
  const mergedProps = useMemo(
    () => ({ ...evaledComponentProperties, ...propsFromTraits }),
    [evaledComponentProperties, propsFromTraits]
  );

  function genSlotsElements() {
    if (!childrenMap[c.id]) {
      return {};
    }
    const res: Record<string, React.ReactElement[] | React.ReactElement> = {};
    for (const slot in childrenMap[c.id]) {
      const slotChildren = childrenMap[c.id][slot].map(child => {
        if (!childrenCache.get(child)) {
          const ele = <ImplWrapper key={child.id} {...props} component={child} />;
          childrenCache.set(child, ele);
        }
        return childrenCache.get(child)!;
      });

      res[slot] = slotChildren.length === 1 ? slotChildren[0] : slotChildren;
    }
    return res;
  }
  const C = unmount ? null : (
    <Impl
      key={c.id}
      {...props}
      {...mergedProps}
      slotsElements={genSlotsElements()}
      mergeState={mergeState}
      subscribeMethods={subscribeMethods}
      elementRef={eleRef}
      getElement={onRef}
    />
  );

  let result = (
    <React.Fragment key={c.id}>
      {C}
      {children}
    </React.Fragment>
  );

  let parentComponent;

  const slotTrait = c.traits.find(t => t.type === `${CORE_VERSION}/${SLOT_TRAIT_NAME}`);

  if (slotTrait && app) {
    parentComponent = app.spec.components.find(
      c => c.id === (slotTrait.properties.container as any).id
    );
  }

  if (parentComponent?.parsedType.name === 'grid_layout') {
    /* eslint-disable */
    const { component, services, app, gridCallbacks, ...restProps } = props;
    /* eslint-enable */
    result = (
      <div key={c.id} data-sunmao-ui-id={c.id} ref={ref} {...restProps}>
        {result}
      </div>
    );
  }

  return result;
});

export const ImplWrapper = React.memo<ImplWrapperProps>(
  _ImplWrapper,
  (prevProps, nextProps) => {
    const prevChildren = prevProps.childrenMap[prevProps.component.id]?._grandChildren;
    const nextChildren = nextProps.childrenMap[nextProps.component.id]?._grandChildren;
    const prevComponent = prevProps.component;
    const nextComponent = nextProps.component;
    let isEqual = false;

    if (prevChildren && nextChildren) {
      isEqual = shallowCompareArray(prevChildren, nextChildren);
    }
    return isEqual && prevComponent === nextComponent;
  }
);
