import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { merge } from 'lodash-es';
import { watch } from '../../utils/watchReactivity';
import {
  RuntimeApplicationComponent,
  ImplWrapperProps,
  TraitResult,
} from '../../types/RuntimeSchema';
import { shallowCompareArray } from '../../utils/shallowCompareArray';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type ApplicationTrait = ArrayElement<RuntimeApplicationComponent['traits']>;

const _ImplWrapper = React.forwardRef<HTMLDivElement, ImplWrapperProps>((props, ref) => {
  const {
    component: c,
    app,
    children,
    componentWrapper: ComponentWrapper,
    services,
    childrenMap,
  } = props;
  const { registry, stateManager, globalHandlerMap, apiService } = props.services;
  const childrenCache = new Map<RuntimeApplicationComponent, React.ReactElement>();

  const Impl = registry.getComponent(c.parsedType.version, c.parsedType.name).impl;

  if (!globalHandlerMap.has(c.id)) {
    globalHandlerMap.set(c.id, {});
  }

  const handlerMap = useRef(globalHandlerMap.get(c.id)!);
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

  const excecuteTrait = useCallback(
    (trait: ApplicationTrait, traitProperty: ApplicationTrait['properties']) => {
      const tImpl = registry.getTrait(
        trait.parsedType.version,
        trait.parsedType.name
      ).impl;
      return tImpl({
        ...traitProperty,
        componentId: c.id,
        mergeState,
        subscribeMethods,
        services,
      });
    },
    [c.id, mergeState, registry, services, subscribeMethods]
  );

  // result returned from traits
  const [traitResults, setTraitResults] = useState<TraitResult<string, string>[]>(() => {
    return c.traits.map(trait =>
      excecuteTrait(trait, stateManager.deepEval(trait.properties).result)
    );
  });

  // eval traits' properties then excecute traits
  useEffect(() => {
    const stops: ReturnType<typeof watch>[] = [];
    const properties: Array<ApplicationTrait['properties']> = [];
    c.traits.forEach((t, i) => {
      const { result, stop } = stateManager.deepEval(
        t.properties,
        ({ result: property }: any) => {
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
    setTraitResults(c.traits.map((trait, i) => excecuteTrait(trait, properties[i])));
    return () => stops.forEach(s => s());
  }, [c.traits, excecuteTrait, stateManager]);

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
    return merge(stateManager.deepEval(c.properties).result, propsFromTraits);
  });

  // eval component properties
  useEffect(() => {
    const { result, stop } = stateManager.deepEval(
      c.properties,
      ({ result: newResult }: any) => {
        setEvaledComponentProperties({ ...newResult });
      }
    );
    // must keep this line, reason is the same as above
    setEvaledComponentProperties({ ...result });
    return stop;
  }, [c.properties, stateManager]);

  const mergedProps = { ...evaledComponentProperties, ...propsFromTraits };

  function genSlotsElements() {
    if (!childrenMap[c.id]) {
      return {};
    }
    const res: Record<string, React.ReactElement[]> = {};
    for (const slot in childrenMap[c.id]) {
      res[slot] = childrenMap[c.id][slot].map(child => {
        if (!childrenCache.get(child)) {
          const ele = <ImplWrapper key={child.id} {...props} component={child} />;
          childrenCache.set(child, ele);
        }
        return childrenCache.get(child)!;
      });
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
    />
  );

  let result = (
    <React.Fragment key={c.id}>
      {C}
      {children}
    </React.Fragment>
  );

  let parentComponent;

  const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');

  if (slotTrait && app) {
    parentComponent = app.spec.components.find(
      c => c.id === (slotTrait.properties.container as any).id
    );
  }
  // wrap component, but grid_layout is root component and cannot be chosen, so don't wrap it
  if (
    ComponentWrapper &&
    c.parsedType.name !== 'dummy' &&
    c.parsedType.name !== 'grid_layout'
  ) {
    result = (
      <ComponentWrapper component={c} parentType={parentComponent?.type || ''}>
        {result}
      </ComponentWrapper>
    );
  }

  if (parentComponent?.parsedType.name === 'grid_layout') {
    // prevent react componentWrapper
    /* eslint-disable */
    const { component, services, app, componentWrapper, gridCallbacks, ...restProps } =
      props;
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
    if (!prevChildren || !nextProps) return false;
    let isEqual = false;

    if (prevChildren && nextChildren) {
      isEqual = shallowCompareArray(prevChildren, nextChildren);
    }
    return isEqual;
  }
);
