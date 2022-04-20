import { useEffect } from 'react';
import { ImplWrapperProps } from '../../../../types';

export function useGlobalHandlerMap(props: ImplWrapperProps) {
  const { component: c, services } = props;
  const { apiService, globalHandlerMap } = services;

  if (!globalHandlerMap.has(c.id)) {
    globalHandlerMap.set(c.id, {});
  }
  const handlerMap = globalHandlerMap.get(c.id);

  useEffect(() => {
    if (!handlerMap) return;

    const handler = (s: { componentId: string; name: string; parameters?: any }) => {
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
      handlerMap.delete(c.id);
    };
  }, [apiService, c.id, handlerMap]);
}
