import { useMemo, useState } from 'react';
import { Application } from '@sunmao-ui/core';
import { GridCallbacks, DIALOG_CONTAINER_ID, initSunmaoUI } from '@sunmao-ui/runtime';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel, Flex } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { StructureTree } from './StructureTree';
import { eventBus } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { useAppModel } from '../operations/useAppModel';
import { EditorHeader } from './EditorHeader';
import { PreviewModal } from './PreviewModal';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { ComponentWrapper } from './ComponentWrapper';
import { StateEditor, SchemaEditor } from './CodeEditor';
import { AppModelManager } from '../operations/AppModelManager';
import { Explorer } from './Explorer';
import { AppStorage } from '../AppStorage';
import {
  ModifyComponentPropertiesLeafOperation,
  ReplaceAppLeafOperation,
} from '../operations/leaf';
import { CreateComponentBranchOperation } from '../operations/branch';
import { editorStore } from '../EditorStore';

type ReturnOfInit = ReturnType<typeof initSunmaoUI>;

type Props = {
  App: ReturnOfInit['App'];
  registry: ReturnOfInit['registry'];
  stateStore: ReturnOfInit['stateManager']['store'];
  apiService: ReturnOfInit['apiService'];
  appModelManager: AppModelManager;
  appStorage: AppStorage;
};

export const Editor: React.FC<Props> = observer(
  ({ App, registry, stateStore, appModelManager, appStorage }) => {
    const { components } = useAppModel(appModelManager);

    const [scale, setScale] = useState(100);
    const [preview, setPreview] = useState(false);
    const [codeMode, setCodeMode] = useState(false);
    const [code, setCode] = useState('');

    const gridCallbacks: GridCallbacks = useMemo(() => {
      return {
        // drag an existing component
        onDragStop(id, layout) {
          eventBus.send(
            'operation',
            new ModifyComponentPropertiesLeafOperation({
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
            new CreateComponentBranchOperation({
              componentType: component,
              parentId: id,
              slot: 'content',
              layout,
            })
          );
        },
      };
    }, []);

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
        <App
          options={app}
          debugEvent={false}
          debugStore={false}
          gridCallbacks={gridCallbacks}
          componentWrapper={ComponentWrapper}
        />
      );
    }, [app, gridCallbacks]);

    const renderMain = () => {
      const appBox = (
        <Box flex="1" background="gray.50" p={4}>
          <Box
            width="100%"
            height="100%"
            background="white"
            transform={`scale(${scale / 100})`}
          >
            <Box
              id={DIALOG_CONTAINER_ID}
              width="full"
              height="full"
              position="absolute"
            />
            {appComponent}
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
          <Box width="280px" borderRightWidth="1px" borderColor="gray.200">
            <Tabs
              align="center"
              height="100%"
              display="flex"
              flexDirection="column"
              textAlign="left"
              isLazy
            >
              <TabList background="gray.50">
                <Tab>Explorer</Tab>
                <Tab>UI Tree</Tab>
                <Tab>State</Tab>
              </TabList>
              <TabPanels flex="1" overflow="auto">
                <TabPanel>
                  <Explorer appStorage={appStorage} />
                </TabPanel>
                <TabPanel p={0}>
                  <StructureTree
                    components={components}
                    selectedComponentId={editorStore.selectedComponentId}
                    onSelectComponent={id => editorStore.setSelectedComponentId(id)}
                    registry={registry}
                  />
                </TabPanel>
                <TabPanel p={0} height="100%">
                  <StateEditor code={JSON.stringify(stateStore, null, 2)} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          {appBox}
          <Box width="320px" borderLeftWidth="1px" borderColor="gray.200" overflow="auto">
            <Tabs
              align="center"
              textAlign="left"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <TabList background="gray.50">
                <Tab>Inspect</Tab>
                <Tab>Insert</Tab>
              </TabList>
              <TabPanels flex="1" overflow="auto">
                <TabPanel p={0}>
                  <ComponentForm
                    app={app}
                    selectedId={editorStore.selectedComponentId}
                    registry={registry}
                    appModelManager={appModelManager}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <ComponentList registry={registry} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </>
      );
    };

    return (
      <KeyboardEventWrapper selectedComponentId={editorStore.selectedComponentId}>
        <Box display="flex" height="100%" width="100%" flexDirection="column">
          <EditorHeader
            scale={scale}
            setScale={setScale}
            onPreview={() => setPreview(true)}
            codeMode={codeMode}
            onCodeMode={v => {
              setCodeMode(v);
              if (!v && code) {
                eventBus.send('operation', new ReplaceAppLeafOperation(JSON.parse(code)));
              }
            }}
          />
          <Box display="flex" flex="1" overflow="auto">
            {renderMain()}
          </Box>
        </Box>
        {preview && (
          <PreviewModal onClose={() => setPreview(false)}>
            <Box width="100%" height="100%">
              <App
                options={JSON.parse(JSON.stringify(app))}
                debugEvent={false}
                debugStore={false}
              />
            </Box>
          </PreviewModal>
        )}
      </KeyboardEventWrapper>
    );
  }
);
