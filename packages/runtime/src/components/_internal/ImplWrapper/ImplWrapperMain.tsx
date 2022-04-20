import React, { useEffect, useMemo, useState } from 'react';
import { merge } from 'lodash-es';
import { RuntimeTraitSchema } from '@sunmao-ui/core';
import { watch } from '../../../utils/watchReactivity';
import { ImplWrapperProps, TraitResult } from '../../../types';
import { useRuntimeFunctions } from './hooks/useRuntimeFunctions';
import { useSlotElements } from './hooks/useSlotChildren';
import { useGlobalHandlerMap } from './hooks/useGlobalHandlerMap';
import { useEleRef } from './hooks/useEleMap';
import { useGridLayout } from './hooks/useGridLayout';

export const ImplWrapperMain = React.forwardRef<HTMLDivElement, ImplWrapperProps>(
  (props, ref) => {
    const { component: c, children } = props;
    console.info('####ImplWrapper Render', c.id);
    const { registry, stateManager } = props.services;

    const Impl = registry.getComponent(c.parsedType.version, c.parsedType.name).impl;

    useGlobalHandlerMap(props);

    const { eleRef, onRef } = useEleRef(props);

    const { mergeState, subscribeMethods, executeTrait } = useRuntimeFunctions(props);

    const [traitResults, setTraitResults] = useState<TraitResult<string, string>[]>(
      () => {
        return c.traits.map(t => executeTrait(t, stateManager.deepEval(t.properties)));
      }
    );

    useEffect(() => {
      return () => {
        delete stateManager.store[c.id];
      };
    }, [c.id, stateManager.store]);

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

          let unmountHooks = prevProps?.unmountHooks || [];
          if (result.props?.unmountHooks) {
            unmountHooks = unmountHooks?.concat(result.props?.unmountHooks);
          }
          let componentDidMount = prevProps?.componentDidMount || [];
          if (result.props?.componentDidMount) {
            componentDidMount = componentDidMount?.concat(result.props?.componentDidMount);
          }
          let componentDidUpdate = prevProps?.componentDidUpdate || [];
          if (result.props?.componentDidUpdate) {
            componentDidUpdate = componentDidUpdate?.concat(result.props?.componentDidUpdate);
          }

          return merge(prevProps, result.props, {
            unmountHooks,
            componentDidMount,
            componentDidUpdate,
          });
        },
        {} as TraitResult<string, string>['props']
      );
    }, [traitResults]);

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
      console.info('####Component DidMount', c.id);
      propsFromTraits?.componentDidMount?.forEach(e => e());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      console.info('####Component Update', c.id);
      propsFromTraits?.componentDidUpdate?.forEach(e => e());
    }, [c.id, propsFromTraits?.componentDidUpdate]);

    useEffect(() => {
      return () => {
        console.info('####Component DidUnmount', c.id, propsFromTraits?.unmountHooks);
        propsFromTraits?.unmountHooks?.forEach(e => e());
      };
      // TODO: We don't add unmountHooks in dependencies, because it will be trigger multiple times
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [c.id, stateManager.store]);

    const mergedProps = useMemo(
      () => ({ ...evaledComponentProperties, ...propsFromTraits }),
      [evaledComponentProperties, propsFromTraits]
    );

    const unmount = traitResults.some(result => result.unmount);
    const slotElements = useSlotElements(props);

    const C = unmount ? null : (
      <Impl
        key={c.id}
        {...props}
        {...mergedProps}
        slotsElements={slotElements}
        mergeState={mergeState}
        subscribeMethods={subscribeMethods}
        elementRef={eleRef}
        getElement={onRef}
      />
    );

    const result = (
      <React.Fragment key={c.id}>
        {C}
        {children}
      </React.Fragment>
    );

    const element = useGridLayout(props, result, ref);

    return element;
  }
);
