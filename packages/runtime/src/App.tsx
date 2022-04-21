import React, { useEffect, useRef } from 'react';
import { initStateAndMethod } from './utils/initStateAndMethod';
import { ImplWrapper } from './components/_internal/ImplWrapper';
import { AppProps, UIServices, AppHooks } from './types';
import { DebugEvent, DebugStore } from './services/DebugComponents';
import { RuntimeAppSchemaManager } from './services/RuntimeAppSchemaManager';
import { resolveChildrenMap } from './utils/resolveChildrenMap';

// inject modules to App
export function genApp(services: UIServices, hooks?: AppHooks) {
  return (props: Omit<AppProps, 'services'>) => {
    return <App {...props} services={services} hooks={hooks} />;
  };
}

export const App: React.FC<AppProps> = props => {
  const {
    options,
    services,
    gridCallbacks,
    debugStore = true,
    debugEvent = true,
    hooks,
  } = props;
  const runtimeAppSchemaManager = useRef(new RuntimeAppSchemaManager());
  const app = runtimeAppSchemaManager.current.update(options);
  initStateAndMethod(services.registry, services.stateManager, app.spec.components);
  const { childrenMap, topLevelComponents } = resolveChildrenMap(app.spec.components);

  useEffect(() => {
    if (hooks?.didMount) {
      hooks.didMount();
    }
  }, [hooks]);

  useEffect(() => {
    if (hooks?.didUpdate) {
      hooks.didUpdate();
    }
  }, [hooks, options]);

  return (
    <div className="App">
      {topLevelComponents.map(c => {
        return (
          <ImplWrapper
            key={c.id}
            component={c}
            services={services}
            childrenMap={childrenMap}
            app={app}
            gridCallbacks={gridCallbacks}
            hooks={hooks}
            isInModule={false}
          />
        );
      })}
      {debugStore && <DebugStore stateManager={services.stateManager} />}
      {debugEvent && <DebugEvent apiService={services.apiService} />}
    </div>
  );
};
