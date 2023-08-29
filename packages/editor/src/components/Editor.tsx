import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Application } from '@sunmao-ui/core';
import { DIALOG_CONTAINER_ID, initSunmaoUI, SunmaoLib } from '@sunmao-ui/runtime';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { StructureTree } from './StructureTree';
import { ComponentList } from './ComponentsList';
import { EditorHeader } from './EditorHeader';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { StateViewer } from './CodeEditor';
import { DataSourceList } from './DataSource';
import { ComponentForm } from './ComponentForm';
import ErrorBoundary from './ErrorBoundary';
import { PreviewModal } from './PreviewModal';
import { WarningArea } from './WarningArea';
import { EditorServices } from '../types';
import { EditorMaskWrapper } from './EditorMaskWrapper';
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
  dependencies: Record<string, any>;
  onRefresh: () => void;
};

export const Editor: React.FC<Props> = observer(
  ({ App, stateStore, services, libs, dependencies, onRefresh: onRefreshApp }) => {
    const { editorStore } = services;
    const {
      components,
      selectedComponentId,
      modules,
      toolMenuTab,
      explorerMenuTab,
      setToolMenuTab,
      setExplorerMenuTab,
    } = editorStore;

    const [isDisplayLeftMenu, setIsDisplayLeftMenu] = useState(true);
    const [isDisplayRightMenu, setIsDisplayRightMenu] = useState(true);
    const [preview, setPreview] = useState(false);
    const [codeMode, setCodeMode] = useState(false);
    const [isDisplayApp, setIsDisplayApp] = useState(true);

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
          <App options={app} />
        </ErrorBoundary>
      ) : null;
    }, [App, app, isDisplayApp]);

    const inspectForm = <ComponentForm services={services} />;

    const onRefresh = useCallback(() => {
      setIsDisplayApp(false);
      onRefreshApp();
    }, [onRefreshApp]);
    useEffect(() => {
      // Wait until the app is completely unmounted before remounting it
      if (isDisplayApp === false) {
        setIsDisplayApp(true);
      }
    }, [isDisplayApp]);
    const onPreview = useCallback(() => setPreview(true), []);
    const onRightTabChange = useCallback(
      activatedTab => {
        setToolMenuTab(activatedTab);
      },
      [setToolMenuTab]
    );

    const renderMain = () => {
      const appBox = (
        <Flex flexDirection="column" width="full" height="full" overflow="hidden">
          <Box
            id="editor-main"
            display="flex"
            transform="auto"
            flexDirection="column"
            width="full"
            height="full"
            position="relative"
            overflow="hidden"
          >
            <EditorMaskWrapper services={services}>
              {appComponent}
              <Box id={DIALOG_CONTAINER_ID} />
            </EditorMaskWrapper>
          </Box>
          <Box id="warning-area" position="relative" flex="0 0 auto">
            <WarningArea services={services} />
          </Box>
        </Flex>
      );

      return (
        <>
          {isDisplayLeftMenu ? (
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
                zIndex="sideMenuIndex"
                height="full"
              >
                <Tabs
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  textAlign="left"
                  lazyBehavior="keepMounted"
                  isLazy
                  index={explorerMenuTab}
                  onChange={activatedTab => {
                    setExplorerMenuTab(activatedTab);
                  }}
                >
                  <TabList
                    background="gray.50"
                    whiteSpace="nowrap"
                    justifyContent="center"
                  >
                    <Tab>Explorer</Tab>
                    <Tab>UI</Tab>
                    <Tab>Data</Tab>
                    <Tab>State</Tab>
                  </TabList>
                  <TabPanels overflow="hidden" height="full" flex="1">
                    <TabPanel height="full" overflow="auto" p={0}>
                      <Explorer services={services} />
                    </TabPanel>
                    <TabPanel height="full" overflow="auto" p={0}>
                      <StructureTree services={services} />
                    </TabPanel>
                    <TabPanel height="full" overflow="auto" p={0}>
                      <DataSourceList services={services} />
                    </TabPanel>
                    <TabPanel overflow="auto" p={0} height="100%">
                      <StateViewer store={stateStore} services={services} />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Resizable>
          ) : null}
          <Flex flex={1} position="relative" overflow="hidden">
            {appBox}
            {isDisplayRightMenu ? (
              <Resizable
                defaultSize={{
                  width: 360,
                  height: '100%',
                }}
                enable={{ left: true }}
                maxWidth={480}
                minWidth={300}
              >
                <Box
                  height="full"
                  borderLeftWidth="1px"
                  borderColor="gray.400"
                  position="relative"
                  zIndex="sideMenuIndex"
                >
                  <Tabs
                    align="center"
                    textAlign="left"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    lazyBehavior="keepMounted"
                    isLazy
                    index={toolMenuTab}
                    onChange={onRightTabChange}
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
            onPreview={onPreview}
            onRefresh={onRefresh}
            isDisplayLeftMenu={isDisplayLeftMenu}
            isDisplayRightMenu={isDisplayRightMenu}
            setIsDisplayLeftMenu={setIsDisplayLeftMenu}
            setIsDisplayRightMenu={setIsDisplayRightMenu}
            onCodeMode={() => setCodeMode(true)}
            services={services}
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
            dependencies={dependencies}
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
