import React, { useMemo, useState, useEffect } from 'react';
import { Application } from '@sunmao-ui/core';
import {
  GridCallbacks,
  DIALOG_CONTAINER_ID,
  initSunmaoUI,
  watch,
} from '@sunmao-ui/runtime';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { StructureTree } from './StructureTree';
import { ComponentList } from './ComponentsList';
import { EditorHeader } from './EditorHeader';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { StateViewer, SchemaEditor } from './CodeEditor';
import { Explorer } from './Explorer';
import { DataSource, DataSourceType } from './DataSource';
import { ApiForm } from './DataSource/ApiForm';
import { StateForm } from './DataSource/StateForm';
import { genOperation } from '../operations';
import { ComponentForm } from './ComponentForm';
import ErrorBoundary from './ErrorBoundary';
import { PreviewModal } from './PreviewModal';
import { WarningArea } from './WarningArea';
import { EditorServices } from '../types';
import { css, cx } from '@emotion/css';
import { EditorMaskWrapper } from './EditorMaskWrapper';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

type Props = {
  App: ReturnOfInit['App'];
  eleMap: ReturnOfInit['eleMap'];
  registry: ReturnOfInit['registry'];
  stateStore: ReturnOfInit['stateManager']['store'];
  services: EditorServices;
};

const ApiFormStyle = css`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
`;

export const Editor: React.FC<Props> = observer(
  ({ App, registry, stateStore, services }) => {
    const { eventBus, editorStore } = services;
    const {
      components,
      selectedComponentId,
      modules,
      activeDataSource,
      activeDataSourceType,
      toolMenuTab,
      explorerMenuTab,
      setToolMenuTab,
      setExplorerMenuTab,
    } = editorStore;

    const [scale, setScale] = useState(100);
    const [preview, setPreview] = useState(false);
    const [codeMode, setCodeMode] = useState(false);
    const [code, setCode] = useState('');
    const [recoverKey, setRecoverKey] = useState(0);
    const [isError, setIsError] = useState<boolean>(false);
    const [store, setStore] = useState(stateStore);
    useEffect(() => {
      const stop = watch(stateStore, newValue => {
        setStore({ ...newValue });
      });

      return stop;
    }, [stateStore]);

    const onError = (err: Error | null) => {
      setIsError(err !== null);
    };

    const gridCallbacks: GridCallbacks = useMemo(() => {
      return {
        // drag an existing component
        onDragStop(id, layout) {
          eventBus.send(
            'operation',
            genOperation(registry, 'modifyComponentProperty', {
              componentId: id,
              properties: { layout },
            })
          );
        },
        // drag a new component from tool box
        onDrop(id, layout, _, e) {
          const component = e.dataTransfer?.getData('component') || '';
          eventBus.send(
            'operation',
            genOperation(registry, 'createComponent', {
              componentType: component,
              parentId: id,
              slot: 'content',
              layout,
            })
          );
        },
      };
    }, [eventBus, registry]);

    const app = useMemo<Application>(() => {
      return {
        version: 'sunmao/v1',
        kind: 'Application',
        metadata: {
          name: 'some App',
        },
        spec: {
          components,
        },
      };
    }, [components]);

    const appComponent = useMemo(() => {
      return (
        <ErrorBoundary key={recoverKey} onError={onError}>
          <App
            options={app}
            debugEvent={false}
            debugStore={false}
            gridCallbacks={gridCallbacks}
          />
        </ErrorBoundary>
      );
    }, [App, app, gridCallbacks, recoverKey]);

    const renderMain = () => {
      const appBox = (
        <Box flex="1" background="gray.50" p={1} overflow="hidden">
          <Box
            width="full"
            height="full"
            background="white"
            overflow="auto"
            transform={`scale(${scale / 100})`}
            position="relative"
          >
            <Box
              id={DIALOG_CONTAINER_ID}
              width="full"
              height="full"
              position="absolute"
            />
            <Box width="full" overflow="auto" position="relative">
              <EditorMaskWrapper services={services}>
                {appComponent}
              </EditorMaskWrapper>
            </Box>
            <WarningArea services={services} />
          </Box>
        </Box>
      );

      if (codeMode) {
        return (
          <Flex width="100%" height="100%">
            <Box flex="1">
              <SchemaEditor
                defaultCode={JSON.stringify(app, null, 2)}
                onChange={setCode}
              />
            </Box>
            {appBox}
          </Flex>
        );
      }
      return (
        <>
          <Box
            width="280px"
            minWidth="280px"
            borderRightWidth="1px"
            borderColor="gray.200"
            position="relative"
            zIndex="2"
          >
            <Tabs
              align="center"
              height="100%"
              display="flex"
              flexDirection="column"
              textAlign="left"
              isLazy
              index={explorerMenuTab}
              onChange={activatedTab => {
                setExplorerMenuTab(activatedTab);
              }}
            >
              <TabList background="gray.50" overflow="auto" whiteSpace="nowrap">
                <Tab>Explorer</Tab>
                <Tab>UI Tree</Tab>
                <Tab>DataSource</Tab>
                <Tab>State</Tab>
              </TabList>
              <TabPanels flex="1" overflow="auto">
                <TabPanel>
                  <Explorer services={services} />
                </TabPanel>
                <TabPanel p={0}>
                  <StructureTree
                    components={components}
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={id => {
                      editorStore.setSelectedComponentId(id);
                    }}
                    services={services}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <DataSource
                    components={components}
                    active={activeDataSource?.id ?? ''}
                    services={services}
                  />
                </TabPanel>
                <TabPanel p={0} height="100%">
                  <StateViewer store={store} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Flex flex={1} position="relative">
            {appBox}
            <Box
              width="320px"
              minWidth="320px"
              borderLeftWidth="1px"
              borderColor="gray.200"
              overflow="auto"
              position="relative"
              zIndex="0"
            >
              <Tabs
                align="center"
                textAlign="left"
                height="100%"
                display="flex"
                flexDirection="column"
                index={toolMenuTab}
                onChange={activatedTab => {
                  setToolMenuTab(activatedTab);
                }}
              >
                <TabList background="gray.50">
                  <Tab>Inspect</Tab>
                  <Tab>Insert</Tab>
                </TabList>
                <TabPanels flex="1" overflow="auto" background="gray.50">
                  <TabPanel p={0}>
                    {activeDataSource && activeDataSourceType === DataSourceType.STATE ? (
                      <StateForm state={activeDataSource} services={services} />
                    ) : (
                      <ComponentForm services={services} />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    <ComponentList services={services} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            {activeDataSource && activeDataSourceType === DataSourceType.API ? (
              <ApiForm
                api={activeDataSource}
                services={services}
                store={store}
                className={cx(ApiFormStyle)}
              />
            ) : null}
          </Flex>
        </>
      );
    };

    useEffect(() => {
      if (isError) {
        setRecoverKey(recoverKey + 1);
      }
    }, [app, isError, recoverKey]);

    return (
      <KeyboardEventWrapper
        components={components}
        selectedComponentId={selectedComponentId}
        services={services}
      >
        <Box display="flex" height="100%" width="100%" flexDirection="column">
          <EditorHeader
            scale={scale}
            setScale={setScale}
            onPreview={() => setPreview(true)}
            codeMode={codeMode}
            onCodeMode={v => {
              setCodeMode(v);
              if (!v && code) {
                eventBus.send(
                  'operation',
                  genOperation(registry, 'replaceApp', {
                    app: JSON.parse(code).spec.components,
                  })
                );
              }
            }}
          />
          <Box display="flex" flex="1" overflow="auto">
            {renderMain()}
          </Box>
        </Box>
        {preview && (
          <PreviewModal onClose={() => setPreview(false)} app={app} modules={modules} />
        )}
      </KeyboardEventWrapper>
    );
  }
);
