import { useEffect } from 'react';
import { DebugLoggerType } from '../../../../services/debug';
import { ImplWrapperProps } from '../../../../types';

export function useGlobalHandlerMap(props: ImplWrapperProps) {
  const { component: c, services } = props;
  const { apiService, globalHandlerMap } = services;

  useEffect(() => {
    if (!globalHandlerMap.has(c.id)) {
      globalHandlerMap.set(c.id, {});
    }
    const handlerMap = globalHandlerMap.get(c.id);
    if (!handlerMap) return;

    const handler = (s: { componentId: string; name: string; parameters?: any }) => {
      if (s.componentId !== c.id) {
        return;
      }
      if (!handlerMap[s.name]) {
        // maybe log?
        return;
      }
      // Logging event-triggered debug messages
      apiService.send('debug', {
        type: DebugLoggerType.TRIGGER_EVENT,
        componentId: s.componentId,
        name: s.name,
        parameters: s.parameters,
        methodType: 'uiMethod',
      });
      handlerMap[s.name](s.parameters);
    };

    apiService.on('uiMethod', handler);

    return () => {
      apiService.off('uiMethod', handler);
      globalHandlerMap.delete(c.id);
    };
  }, [apiService, c.id, globalHandlerMap]);
}
