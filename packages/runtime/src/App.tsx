import React, { useMemo } from 'react';
import { createApplication } from '@sunmao-ui/core';
import { initStateAndMethod } from './utils/initStateAndMethod';
import { ImplWrapper } from './components/_internal/ImplWrapper';
import { resolveAppComponents } from './services/resolveAppComponents';
import { AppProps, UIServices } from './types/RuntimeSchema';
import { DebugEvent, DebugStore } from './services/DebugComponents';
import { getSlotWithMap } from './components/_internal/Slot';

// inject modules to App
export function genApp(services: UIServices) {
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
    [app, componentWrapper, gridCallbacks, services]
  );
  return (
    <div className="App" style={{ height: '100vh', overflow: 'auto' }}>
      {topLevelComponents.map(c => {
        const slotsMap = slotComponentsMap.get(c.id);
        const Slot = getSlotWithMap(slotsMap);
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            services={services}
            slotsMap={slotsMap}
            Slot={Slot}
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
