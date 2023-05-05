import { useEffect, useRef } from 'react';
import isEqual from 'lodash/isEqual';

const useDeepCompareEffect = (
  effect: React.EffectCallback,
  deps: React.DependencyList
) => {
  const prevDeps = useRef<React.DependencyList | null>(null);

  useEffect(() => {
    if (prevDeps.current && !isEqual(deps, prevDeps.current)) {
      effect();
    }
    prevDeps.current = deps;
  }, [deps, effect]);
};

export default useDeepCompareEffect;
