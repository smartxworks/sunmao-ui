import { Application } from '@meta-ui/core';
import { useEffect, useState } from 'react';
import { DefaultAppSchema } from '../constants';
import { eventBus } from '../eventBus';
import { AppModelManager } from './AppModelManager';

const appModelManager = new AppModelManager(DefaultAppSchema);

export function useAppModel() {
  const [app, setApp] = useState<Application>(appModelManager.getApp());

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
