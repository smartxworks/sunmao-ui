import React, { useEffect, useRef } from 'react';
import { initStateAndMethod } from './utils/initStateAndMethod';
import { ImplWrapper } from './components/_internal/ImplWrapper';
import { AppProps, UIServices, AppLifeCycles } from './types';
import { DebugEvent, DebugStore } from './services/DebugComponents';
import { RuntimeAppSchemaManager } from './services/RuntimeAppSchemaManager';
import { resolveChildrenMap } from './utils/resolveChildrenMap';

// inject modules to App
export function genApp(services: UIServices, lifeCycles?: AppLifeCycles) {
  return (props: Omit<AppProps, 'services'>) => {
    return <App {...props} services={services} lifeCycles={lifeCycles} />;
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
    lifeCycles,
  } = props;
  const runtimeAppSchemaManager = useRef(new RuntimeAppSchemaManager());
  const app = runtimeAppSchemaManager.current.update(options);
  initStateAndMethod(services.registry, services.stateManager, app.spec.components);
  const { childrenMap, topLevelComponents } = resolveChildrenMap(app.spec.components);

  useEffect(() => {
    console.log('runtime didmount');
    if (lifeCycles?.didMount) {
      lifeCycles.didMount();
    }
  }, [lifeCycles]);

  useEffect(() => {
    console.log('runtime didUpdate');
    if (lifeCycles?.didUpdate) {
      lifeCycles.didUpdate();
    }
  }, [lifeCycles, options]);

  return (
    <div className="App" style={{ height: '100%', overflow: 'auto' }}>
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            services={services}
            childrenMap={childrenMap}
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
