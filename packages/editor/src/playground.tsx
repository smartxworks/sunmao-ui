import { Flex, Box, ChakraProvider, Button } from '@chakra-ui/react';
import { Application } from '@sunmao-ui/core';
import { initMetaUI } from '@sunmao-ui/runtime';
import { Registry } from '@sunmao-ui/runtime/lib/services/registry';
import { StrictMode, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { Editor } from './components/Editor';
import { AppModelManager } from './operations/AppModelManager';

type Example = {
  name: string;
  value: {
    app: Application;
    modules?: Parameters<Registry['registerModule']>[0][];
  };
};

const Playground: React.FC<{ examples: Example[] }> = ({ examples }) => {
  const [example, setExample] = useState<Example | null>(examples[0]);

  const { App, registry, stateStore, appModelManager, apiService } = useMemo(() => {
    if (!example) {
      return {};
    }
    const metaUI = initMetaUI();
    const App = metaUI.App;
    const registry = metaUI.registry;
    const apiService = metaUI.apiService;
    const stateStore = metaUI.stateManager.store;

    const { app, modules = [] } = example.value;
    modules.forEach(m => {
      registry.registerModule(m);
    });
    localStorage.removeItem('schema');
    const appModelManager = new AppModelManager(app, registry);

    return {
      App,
      registry,
      stateStore,
      appModelManager,
      apiService,
    };
  }, [example]);

  return (
    <Flex width="100vw" height="100vh">
      <Box shadow="md">
        <Box width="200px" height="100%" overflow="auto" pl={2}>
          {examples.map(e => (
            <Button
              variant={example === e ? 'solid' : 'ghost'}
              key={e.name}
              onClick={() => {
                /**
                 * Currently, the data flow between the useAppModel and
                 * the AppModelManager is a little wierd.
                 * When initialize the AppModelManager, it will notify
                 * the useAppModel hook, which will cause the Editor
                 * component update.
                 * React does not like this and throw Error to complain
                 * the Editor and the Playground components are updating
                 * together.
                 * So we set example to null, which unmount the editor
                 * first. Then we can re-create the editor with new example
                 * spec.
                 */
                setExample(null);
                setTimeout(() => {
                  setExample(e);
                }, 0);
              }}
            >
              {e.name}
            </Button>
          ))}
        </Box>
      </Box>
      <Box flex="1">
        {appModelManager && (
          <Editor
            key={example!.name}
            App={App!}
            registry={registry!}
            stateStore={stateStore!}
            appModelManager={appModelManager}
            apiService={apiService!}
          />
        )}
      </Box>
    </Flex>
  );
};

export default function renderPlayground(examples: Example[]) {
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider>
        <Playground examples={examples} />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root')
  );
}
