import { useEffect, useMemo, useState } from 'react';
import { GridCallbacks } from '@meta-ui/runtime';
import produce from 'immer';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { last } from 'lodash';
import { App, stateStore } from '../metaUI';
import { StructureTree } from './StructureTree';
import {
  CreateComponentOperation,
  ModifyComponentPropertyOperation,
} from '../operations/Operations';
import { eventBus, SelectComponentEvent } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { appModelManager, useAppModel } from '../operations/useAppModel';
import { EditorHeader } from './EditorHeader';
import { PreviewModal } from './PreviewModal';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { ComponentWrapper } from './ComponentWrapper';

export const Editor = () => {
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [scale, setScale] = useState(100);
  const [preview, setPreview] = useState(false);
  const { app } = useAppModel();

  useEffect(() => {
    eventBus.on(SelectComponentEvent, id => {
      setSelectedComponentId(id);
    });
  }, [setSelectedComponentId]);

  const gridCallbacks: GridCallbacks = useMemo(() => {
    return {
      onDragStop(id, layout) {
        eventBus.send(
          'operation',
          new ModifyComponentPropertyOperation(id, 'layout', layout)
        );
      },
      onDrop(id, layout, _, e) {
        const component = e.dataTransfer?.getData('component') || '';
        const componentId = appModelManager.genId(component);
        eventBus.send(
          'operation',
          new CreateComponentOperation(component, id, 'content')
        );

        const newLayout = produce(layout, draft => {
          draft.forEach(l => {
            if (l.i === '__dropping-elem__') {
              l.i = componentId;
            }
          });
        }).filter(v => !!v); // there is unknown empty in array

        eventBus.send(
          'operation',
          new ModifyComponentPropertyOperation(id, 'layout', newLayout)
        );
      },
    };
  }, []);

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

  return (
    <KeyboardEventWrapper selectedComponentId={selectedComponentId}>
      <Box display="flex" height="100vh" width="100vw" flexDirection="column">
        <EditorHeader
          scale={scale}
          setScale={setScale}
          onPreview={() => setPreview(true)}
        />
        <Box display="flex" flex="1">
          <Box width="280px" borderRightWidth="1px" borderColor="gray.200">
            <Tabs
              align="center"
              height="100%"
              display="flex"
              flexDirection="column"
              textAlign="left"
            >
              <TabList background="gray.50">
                <Tab>UI Tree</Tab>
                <Tab>State</Tab>
              </TabList>
              <TabPanels flex="1" overflow="auto">
                <TabPanel p={0}>
                  <StructureTree
                    app={app}
                    selectedComponentId={selectedComponentId}
                    onSelectComponent={id => setSelectedComponentId(id)}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <pre>{JSON.stringify(stateStore, null, 2)}</pre>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Box flex="1" background="gray.50" p={4}>
            <Box
              widht="100%"
              height="100%"
              background="white"
              transform={`scale(${scale / 100})`}
            >
              {appComponent}
            </Box>
          </Box>
          <Box width="320px" borderLeftWidth="1px" borderColor="gray.200">
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
                  <ComponentForm app={app} selectedId={selectedComponentId} />
                </TabPanel>
                <TabPanel p={0}>
                  <ComponentList />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
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
};
