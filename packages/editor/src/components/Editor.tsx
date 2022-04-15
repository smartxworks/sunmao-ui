import React, { useMemo, useState, useEffect } from 'react';
import { Application } from '@sunmao-ui/core';
import {
  GridCallbacks,
  DIALOG_CONTAINER_ID,
  initSunmaoUI,
  SunmaoLib,
} from '@sunmao-ui/runtime';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { StructureTree } from './StructureTree';
import { ComponentList } from './ComponentsList';
import { EditorHeader } from './EditorHeader';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { StateViewer, SchemaEditor } from './CodeEditor';
import { DataSource, DataSourceType } from './DataSource';
import { ApiForm } from './DataSource/ApiForm';
import { StateForm } from './DataSource/StateForm';
import { genOperation } from '../operations';
import { ComponentForm } from './ComponentForm';
import ErrorBoundary from './ErrorBoundary';
import { PreviewModal } from './PreviewModal';
import { WarningArea } from './WarningArea';
import { EditorServices, UIPros } from '../types';
import { css } from '@emotion/css';
import { EditorMaskWrapper } from './EditorMaskWrapper';
import { AppModel } from '../AppModel/AppModel';
import { LocalStorageForm } from './DataSource/LocalStorageForm';
import { Explorer } from './Explorer';
import { Resizable } from 're-resizable';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

type Props = {
  App: ReturnOfInit['App'];
  eleMap: ReturnOfInit['eleMap'];
  registry: ReturnOfInit['registry'];
  stateStore: ReturnOfInit['stateManager']['store'];
  services: EditorServices;
  libs: SunmaoLib[];
  uiProps: UIPros
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
  ({ App, registry, stateStore, services, libs, uiProps }) => {
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

    const dataSourceForm = useMemo(() => {
      let component: React.ReactNode = <ComponentForm services={services} />;
      if (!activeDataSource) {
        return component;
      }
      switch (activeDataSourceType) {
        case DataSourceType.STATE:
          component = <StateForm state={activeDataSource} services={services} />;
          break;
        case DataSourceType.LOCALSTORAGE:
          component = <LocalStorageForm state={activeDataSource} services={services} />;
          break;
        default:
          break;
      }
      return component;
    }, [activeDataSource, services, activeDataSourceType]);

    useEffect(() => {
      // when errors happened, `ErrorBoundary` wouldn't update until rerender
      // so after the errors are fixed, would trigger this effect before `setError(false)`
      // the process to handle the error is:
      // app change -> error happen -> setError(true) -> setRecoverKey(recoverKey + 1) -> app change -> setRecoverKey(recoverKey + 1) -> setError(false)
      if (isError) {
        setRecoverKey(recoverKey + 1);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [app, isError]); // it only should depend on the app schema and `isError` to update

    const renderMain = () => {
      const appBox = (
        <Flex flexDirection="column" width="full" height="full" overflow="hidden">
          <Box
            id="editor-main"
            display="flex"
            flexDirection="column"
            width="full"
            height="full"
            overflow="auto"
            padding="20px"
            transform={`scale(${scale / 100})`}
            position="relative"
          >
            <EditorMaskWrapper services={services}>
              {appComponent}
              <Box id={DIALOG_CONTAINER_ID} />
            </EditorMaskWrapper>
          </Box>
          <Box id="warning-area" height="48px" position="relative" flex="0 0 auto">
            <WarningArea services={services} />
          </Box>
        </Flex>
      );

      if (codeMode) {
        return (
          <Flex width="100%" height="100%">
            <Box width="full" height="full">
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
          <Resizable
            defaultSize={{
              width: 280,
              height: '100%',
            }}
            enable={{ right: true }}
            style={{ zIndex: 2 }}
            maxWidth={480}
            minWidth={200}
          >
            <Box
              borderRightWidth="1px"
              borderColor="gray.200"
              position="relative"
              zIndex="2"
              height="full"
            >
              <Tabs
                height="100%"
                display="flex"
                flexDirection="column"
                textAlign="left"
                lazyBehavior={uiProps.explorerMenuLazyBehavior}
                isLazy
                index={explorerMenuTab}
                onChange={activatedTab => {
                  setExplorerMenuTab(activatedTab);
                }}
              >
                <TabList background="gray.50" whiteSpace="nowrap" justifyContent="center">
                  <Tab>Explorer</Tab>
                  <Tab>UI</Tab>
                  <Tab>Data</Tab>
                  <Tab>State</Tab>
                </TabList>
                <TabPanels flex="1" overflow="auto">
                  <TabPanel p={0}>
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
                    <DataSource active={activeDataSource?.id ?? ''} services={services} />
                  </TabPanel>
                  <TabPanel p={0} height="100%">
                    <StateViewer store={stateStore} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Resizable>
          <Flex flex={1} position="relative" overflow="hidden">
            {appBox}
            <Resizable
              defaultSize={{
                width: 320,
                height: '100%',
              }}
              enable={{ left: true }}
              maxWidth={480}
              minWidth={250}
            >
              <Box
                height="full"
                borderLeftWidth="1px"
                borderColor="gray.200"
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
                    <TabPanel p={0}>{dataSourceForm}</TabPanel>
                    <TabPanel p={0}>
                      <ComponentList services={services} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Resizable>
            {activeDataSource && activeDataSourceType === DataSourceType.API ? (
              <ApiForm
                key={activeDataSource.id}
                api={activeDataSource}
                services={services}
                store={stateStore}
                className={ApiFormStyle}
              />
            ) : null}
          </Flex>
        </>
      );
    };

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
                    app: new AppModel(JSON.parse(code).spec.components, registry),
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
          <PreviewModal
            onClose={() => setPreview(false)}
            app={app}
            modules={modules}
            libs={libs}
          />
        )}
      </KeyboardEventWrapper>
    );
  }
);
