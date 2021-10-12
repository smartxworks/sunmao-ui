import { useMemo, useState } from 'react';
import { GridCallbacks } from '@meta-ui/runtime';
import { Box } from '@chakra-ui/react';
import produce from 'immer';
import { App } from '../metaUI';
import { StructureTree } from './StructureTree';
import {
  CreateComponentOperation,
  ModifyComponentPropertyOperation,
} from '../operations/Operations';
import { eventBus } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { appModelManager, useAppModel } from '../operations/useAppModel';
import { KeyboardEventWrapper } from './KeyboardEventWrapper';
import { genComponentWrapper } from './ComponentWrapper';

export const Editor = () => {
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [hoverComponentId, setHoverComponentId] = useState('');
  const { app } = useAppModel();

  const Wrapper = useMemo(() => {
    const onClick = (id: string) => {
      setSelectedComponentId(() => id);
    };
    const onMouseOver = (id: string) => {
      setHoverComponentId(() => id);
    };
    const onMouseLeave = () => {
      // TODO: it will cause bug that can not resize grid component
      // if (hoverComponentId === id) {
      //   setHoverComponentId(() => '');
      // }
    };
    return genComponentWrapper(
      selectedComponentId,
      hoverComponentId,
      onClick,
      onMouseOver,
      onMouseLeave
    );
  }, [
    selectedComponentId,
    setSelectedComponentId,
    hoverComponentId,
    setHoverComponentId,
  ]);

  const gridCallbacks: GridCallbacks = useMemo(() => {
    return {
      onDragStop(id, layout) {
        console.log('dragstop');
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

  return (
    <KeyboardEventWrapper selectedComponentId={selectedComponentId}>
      <Box display="flex" height="100vh" width="100vw">
        <Box flex="1">
          <StructureTree app={app} onSelectComponent={id => setSelectedComponentId(id)} />
        </Box>
        <Box flex="1">
          <strong>Drag Component to canvas!</strong>
          <ComponentList />
        </Box>
        <Box flex="3" borderRight="2px solid black">
          <App
            options={app}
            debugEvent={false}
            debugStore={false}
            gridCallbacks={gridCallbacks}
            componentWrapper={Wrapper}
          />
        </Box>
        <Box flex="1" borderRight="2px solid black">
          <ComponentForm app={app} selectedId={selectedComponentId} />
        </Box>
      </Box>
    </KeyboardEventWrapper>
  );
};
