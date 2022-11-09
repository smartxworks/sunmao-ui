import { useEffect, useRef } from 'react';
import { ImplWrapperProps } from '../../../../types';

export function useEleRef(props: ImplWrapperProps) {
  const { component: c, services, hooks, isInModule } = props;
  const { stateManager, eleMap } = services;

  const eleRef = useRef<HTMLElement>();
  const onRef = (ele: HTMLElement) => {
    // If a component is in module, it should not have mask, so we needn't set it
    if (!isInModule) {
      eleMap.set(c.id, ele);
    }
    hooks?.didDomUpdate && hooks?.didDomUpdate();
  };

  // When component recover from error state, eleRef.current will not update automatically,
  // so we need do it manually
  const onRecoverFromError = () => {
    if (eleRef.current && !isInModule) {
      eleMap.set(c.id, eleRef.current);
    }
    hooks?.didDomUpdate && hooks?.didDomUpdate();
  };

  useEffect(() => {
    // If a component is in module, it should not have mask, so we needn't set it
    if (eleRef.current && !isInModule) {
      eleMap.set(c.id, eleRef.current);
    }
    hooks?.didDomUpdate && hooks?.didDomUpdate();
    return () => {
      if (!isInModule) {
        eleMap.delete(c.id);
      }
      hooks?.didDomUpdate && hooks?.didDomUpdate();
    };
    // These dependencies should not change in the whole life cycle of ImplWrapper.
    // Otherwise, the clear function will run unexpectedly
  }, [c.id, eleMap, hooks, isInModule, stateManager.store]);

  return {
    eleRef,
    onRef,
    onRecoverFromError,
  };
}
