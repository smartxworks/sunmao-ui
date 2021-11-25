import { Application } from '@sunmao-ui/core';
import { useEffect, useState } from 'react';
import { DefaultAppSchema } from '../constants';
import { eventBus } from '../eventBus';

export function useAppModel() {
  const [app, setApp] = useState<Application>(DefaultAppSchema);

  useEffect(() => {
    const onAppChange = (app: Application) => {
      setApp(() => app);
    };
    eventBus.on('appChange', onAppChange);

    return () => {
      eventBus.off('appChange', onAppChange);
    };
  }, []);

  return {
    app,
  };
}
