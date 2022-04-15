import React, { useEffect, useMemo, useRef, useState } from 'react';
import { merge } from 'lodash-es';
import { RuntimeComponentSchema, RuntimeTraitSchema } from '@sunmao-ui/core';
import { watch } from '../../../utils/watchReactivity';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { useRuntimeFunctions } from './useRuntimeFunctions';
import { ImplWrapper } from './ImplWrapper';

export const ImplWrapperMain = React.forwardRef<HTMLDivElement, ImplWrapperProps>(
  (props, ref) => {
    const { component: c, app, children, childrenMap, hooks, isInModule } = props;
    console.info('####ImplWrapper Render', c.id);
    const { registry, stateManager, globalHandlerMap, apiService, eleMap } =
      props.services;
    const childrenCache = new Map<RuntimeComponentSchema, React.ReactElement>();
    const traitStops = useRef<any[]>();

    const Impl = registry.getComponent(c.parsedType.version, c.parsedType.name).impl;

    if (!globalHandlerMap.has(c.id)) {
      globalHandlerMap.set(c.id, {});
    }

    const eleRef = useRef<HTMLElement>();
    const onRef = (ele: HTMLElement) => {
      // If a component is in module, it should not have mask, so we needn't set it
      if (!isInModule) {
        eleMap.set(c.id, ele);
      }
      hooks?.didDomUpdate && hooks?.didDomUpdate();
    };

    const { mergeState, subscribeMethods, executeTrait, handlerMapRef } =
      useRuntimeFunctions(props);

    useEffect(() => {
      console.info('####ImplWrapper DidMount', c.id);
      // If a component is in module, it should not have mask, so we needn't set it
      if (eleRef.current && !isInModule) {
        eleMap.set(c.id, eleRef.current);
      }
      return () => {
        console.info('####ImplWrapper DidUnmount', c.id);
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
        if (!handlerMapRef.current[s.name]) {
          // maybe log?
          return;
        }
        handlerMapRef.current[s.name](s.parameters);
      };
      apiService.on('uiMethod', handler);
      return () => {
        apiService.off('uiMethod', handler);
        globalHandlerMap.delete(c.id);
      };
    }, [apiService, c.id, globalHandlerMap, handlerMapRef]);

    // // result returned from traits
    // const [traitResults, setTraitResults] = useState<TraitResult<string, string>[]>(
    //   () => {
    //     const stops: ReturnType<typeof watch>[] = [];
    //     const properties: Array<RuntimeTraitSchema['properties']> = [];
    //     c.traits.forEach((t, i) => {
    //       const { result, stop } = stateManager.deepEvalAndWatch(
    //         t.properties,
    //         ({ result: property }: any) => {
    //           console.log('trait变了', t.type, property);
    //           const traitResult = executeTrait(t, property);
    //           setTraitResults(oldResults => {
    //             // assume traits number and order will not change
    //             const newResults = [...oldResults];
    //             newResults[i] = traitResult;
    //             return newResults;
    //           });
    //           stops.push(stop);
    //         },
    //         { fallbackWhenError: () => undefined }
    //       );
    //       properties.push(result);
    //     });
    //     // although traitResults has initialized in useState, it must be set here again
    //     // because mergeState will be called during the first render of component, and state will change
    //     traitStops.current = stops;
    //     console.log('set了一遍 traitresult', c.id);
    //     return c.traits.map((trait, i) => executeTrait(trait, properties[i]));
    //   }
    // );

    const [traitResults, setTraitResults] = useState<TraitResult<string, string>[]>(
      () => {
        return c.traits.map(t => executeTrait(t, stateManager.deepEval(t.properties)));
      }
    );

    useEffect(() => {
      return () => {
        traitStops.current?.forEach((stop: any) => stop());
      };
    });

    // eval traits' properties then execute traits
    useEffect(() => {
      console.log('开始监听 trait 表达式变化', c.id);
      const stops: ReturnType<typeof watch>[] = [];
      const properties: Array<RuntimeTraitSchema['properties']> = [];
      c.traits.forEach((t, i) => {
        const { result, stop } = stateManager.deepEvalAndWatch(
          t.properties,
          ({ result: property }: any) => {
            console.log('trait变了', t.type, property);
            const traitResult = executeTrait(t, property);
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
      // setTraitResults(c.traits.map((trait, i) => executeTrait(trait, properties[i])));
      return () => stops.forEach(s => s());
    }, [c.id, c.traits, executeTrait, stateManager]);

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
      return () => {
        delete stateManager.store[c.id];
      };
    }, [c.id, stateManager.store]);

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

    const slotTrait = c.traits.find(t => t.type === 'core/v1/slot');

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
  }
);
