import { useMemo, useState } from 'react';
import { GridCallbacks } from '@meta-ui/runtime';
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { last } from 'lodash';
import { App, stateStore } from '../metaUI';
import { StructureTree } from './StructureTree';
import {
  CreateComponentOperation,
  ModifyComponentPropertyOperation,
} from '../operations/Operations';
import { eventBus } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { EditorHeader } from './EditorHeader';
import { PreviewModal } from './PreviewModal';
import { useAppModel } from '../operations/useAppModel';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';

let count = 0;
export const Editor = () => {
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [scale, setScale] = useState(100);
  const [preview, setPreview] = useState(false);
  const { app } = useAppModel();

  const Wrapper: React.FC<{ id: string }> = useMemo(() => {
    return props => {
      const style = css`
        height: 100%;
      `;
      const onClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setSelectedComponentId(() => props.id);
      };
      return (
        <Box
          onClick={onClick}
          css={style}
          boxShadow={props.id === selectedComponentId ? 'outline' : undefined}>
          {props.children}
        </Box>
      );
    };
  }, [selectedComponentId]);

  const gridCallbacks: GridCallbacks = {
    onDragStop(id, layout) {
      eventBus.send(
        'operation',
        new ModifyComponentPropertyOperation(id, 'layout', layout)
      );
    },
    onDrop(id, layout, item, e) {
      const component = e.dataTransfer?.getData('component') || '';
      const componentName = last(component.split('/'));
      const componentId = `${componentName}_${count++}`;
      eventBus.send(
        'operation',
        new CreateComponentOperation(id, 'container', component, componentId)
      );

      const newLayout = [
        ...layout,
        {
          ...item,
          w: 3,
          i: componentId,
        },
      ];

      eventBus.send(
        'operation',
        new ModifyComponentPropertyOperation(id, 'layout', newLayout)
      );
    },
  };

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
              textAlign="left">
              <TabList background="gray.50">
                <Tab>UI Tree</Tab>
                <Tab>State</Tab>
              </TabList>
              <TabPanels flex="1" overflow="auto">
                <TabPanel p={0}>
                  <StructureTree
                    app={app}
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
              transform={`scale(${scale / 100})`}>
              <App
                options={app}
                debugEvent={false}
                debugStore={false}
                gridCallbacks={gridCallbacks}
                componentWrapper={Wrapper}
              />
            </Box>
          </Box>
          <Box width="320px" borderLeftWidth="1px" borderColor="gray.200">
            <Tabs
              align="center"
              textAlign="left"
              height="100%"
              display="flex"
              flexDirection="column">
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
