import React, { useMemo } from 'react';
import { createApplication } from '@meta-ui/core';
import { initStateAndMethod } from './utils/initStateAndMethod';
import { ImplWrapper } from './services/ImplWrapper';
import { resolveAppComponents } from './services/resolveAppComponents';
import { AppProps, MetaUIServices } from './types/RuntimeSchema';
import { DebugEvent, DebugStore } from './services/DebugComponents';

// inject modules to App
export function genApp(services: MetaUIServices) {
  return (props: Omit<AppProps, 'services'>) => {
    return <App {...props} services={services} />;
  };
}

export const App: React.FC<AppProps> = props => {
  const {
    options,
    services,
    componentWrapper,
    gridCallbacks,
    debugStore = true,
    debugEvent = true,
  } = props;
  const app = createApplication(options);

  initStateAndMethod(services.registry, services.stateManager, app.spec.components);

  const { topLevelComponents, slotComponentsMap } = useMemo(
    () =>
      resolveAppComponents(app.spec.components, {
        services,
        app,
        componentWrapper,
        gridCallbacks,
      }),
    [app]
  );

  return (
    <div className="App">
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            services={services}
            slotsMap={slotComponentsMap.get(c.id)}
            targetSlot={null}
            app={app}
            componentWrapper={componentWrapper}
            gridCallbacks={gridCallbacks}
          />
        );
      })}
      {debugStore && <DebugStore stateManager={services.stateManager} />}
      {debugEvent && <DebugEvent apiService={services.apiService} />}
    </div>
  );
};
