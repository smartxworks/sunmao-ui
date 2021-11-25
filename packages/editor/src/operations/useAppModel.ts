import { Application } from '@sunmao-ui/core';
import { useEffect, useState } from 'react';
import { DefaultAppSchema } from '../constants';
import { eventBus } from '../eventBus';

export function getDefaultAppFromLS() {
  try {
    const appFromLS = localStorage.getItem('schema');
    if (appFromLS) {
      return JSON.parse(appFromLS);
    }
    return DefaultAppSchema;
  } catch (error) {
    console.warn(error);
    return DefaultAppSchema;
  }
}

export function useAppModel() {
  const [app, setApp] = useState<Application>(getDefaultAppFromLS());

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
