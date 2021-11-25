import { ApplicationComponent } from '@sunmao-ui/core';
import { useEffect, useState } from 'react';
import { eventBus } from '../eventBus';
import { AppModelManager } from './AppModelManager';

export function useAppModel(appModalManager: AppModelManager) {
  const [components, setComponents] = useState<ApplicationComponent[]>(
    appModalManager.components
  );

  useEffect(() => {
    const onComponents = (components: ApplicationComponent[]) => {
      console.log('componentsChange', components);
      setComponents(() => components);
    };
    eventBus.on('componentsChange', onComponents);

    return () => {
      eventBus.off('componentsChange', onComponents);
    };
  }, []);

  return {
    components,
  };
}
