import { useEffect, useMemo, useState } from 'react';
import { GridCallbacks } from '@meta-ui/runtime';
import { Box } from '@chakra-ui/react';
import produce from 'immer';
import { App } from '../metaUI';
import { StructureTree } from './StructureTree';
import {
  CreateComponentOperation,
  ModifyComponentPropertyOperation,
} from '../operations/Operations';
import { eventBus, SelectComponentEvent } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { appModelManager, useAppModel } from '../operations/useAppModel';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { ComponentWrapper } from './ComponentWrapper';

export const Editor = () => {
  const [selectedComponentId, setSelectedComponentId] = useState('');
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
          new CreateComponentOperation(id, 'container', component, componentId)
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
      <Box display="flex" height="100vh" width="100vw">
        <Box flex="1">
          <StructureTree
            app={app}
            selectedComponentId={selectedComponentId}
            onSelectComponent={id => setSelectedComponentId(id)}
          />
        </Box>
        <Box flex="1">
          <strong>Drag Component to canvas!</strong>
          <ComponentList />
        </Box>
        <Box flex="3" borderRight="2px solid black">
          {appComponent}
        </Box>
        <Box flex="1" borderRight="2px solid black">
          <ComponentForm app={app} selectedId={selectedComponentId} />
        </Box>
      </Box>
    </KeyboardEventWrapper>
  );
};
