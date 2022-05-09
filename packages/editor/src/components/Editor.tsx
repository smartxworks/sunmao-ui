import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
import { StateViewer } from './CodeEditor';
import { DataSource } from './DataSource';
import { DataSourceType, DATASOURCE_TRAIT_TYPE_MAP } from '../constants/dataSource';
import { ApiForm } from './DataSource/ApiForm';
import { genOperation } from '../operations';
import { ComponentForm } from './ComponentForm';
import ErrorBoundary from './ErrorBoundary';
import { PreviewModal } from './PreviewModal';
import { WarningArea } from './WarningArea';
import { EditorServices, UIPros } from '../types';
import { css } from '@emotion/css';
import { EditorMaskWrapper } from './EditorMaskWrapper';
import { DataForm } from './DataSource/DataForm';
import { Explorer } from './Explorer';
import { Resizable } from 're-resizable';
import { CodeModeModal } from './CodeModeModal';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

type Props = {
  App: ReturnOfInit['App'];
  eleMap: ReturnOfInit['eleMap'];
  registry: ReturnOfInit['registry'];
  stateStore: ReturnOfInit['stateManager']['store'];
  services: EditorServices;
  libs: SunmaoLib[];
  onRefresh: () => void;
  uiProps: UIPros;
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
  ({ App, registry, stateStore, services, libs, uiProps, onRefresh: onRefreshApp }) => {
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
    const [isDisplayApp, setIsDisplayApp] = useState(true);

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
      return isDisplayApp ? (
        <ErrorBoundary>
          <App
            options={app}
            debugEvent={false}
            debugStore={false}
            gridCallbacks={gridCallbacks}
          />
        </ErrorBoundary>
      ) : null;
    }, [App, app, gridCallbacks, isDisplayApp]);

    const inspectForm = useMemo(() => {
      if (activeDataSource && activeDataSourceType) {
        return (
          <DataForm
            datasource={activeDataSource}
            services={services}
            traitType={DATASOURCE_TRAIT_TYPE_MAP[activeDataSourceType]}
          />
        );
      } else {
        return <ComponentForm services={services} />;
      }
    }, [activeDataSource, services, activeDataSourceType]);

    const onRefresh = useCallback(() => {
      services.stateManager.clear();
      setIsDisplayApp(false);
      onRefreshApp();
    }, [services.stateManager, onRefreshApp]);
    useEffect(() => {
      // Wait until the app is completely unmounted before remounting it
      if (isDisplayApp === false) {
        setIsDisplayApp(true);
      }
    }, [isDisplayApp]);
    const onPreview = useCallback(() => setPreview(true), []);

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

      return (
        <>
          <Resizable
            defaultSize={{
              width: 300,
              height: '100%',
            }}
            enable={{ right: true }}
            style={{ zIndex: 2 }}
            maxWidth={480}
            minWidth={300}
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
                    <TabPanel p={0}>{inspectForm}</TabPanel>
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
            onPreview={onPreview}
            onRefresh={onRefresh}
            onCodeMode={() => setCodeMode(true)}
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
        {codeMode && (
          <CodeModeModal
            onClose={() => setCodeMode(false)}
            app={app}
            services={services}
          />
        )}
      </KeyboardEventWrapper>
    );
  }
);
