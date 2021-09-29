import { useCallback, useEffect, useMemo, useState } from 'react';
import { Application } from '@meta-ui/core';
import { Box } from '@chakra-ui/react';
import { DefaultAppSchema } from '../constants';
import { App } from '../metaUI';
import { StructureTree } from './StructureTree';
import { OperationManager } from '../operations/OperationManager';
import {
  CreateComponentOperation,
  ModifyComponentPropertyOperation,
} from '../operations/Operations';
import { eventBus } from '../eventBus';
import { ComponentForm } from './ComponentForm';
import { ComponentList } from './ComponentsList';
import { GridCallbacks } from '../../../runtime/lib/types/RuntimeSchema';

const operationManager = new OperationManager(DefaultAppSchema);
let count = 0;
export const Editor = () => {
  const [selectedComponentId, setSelectedComponentId] = useState('');
  const [app, setApp] = useState<Application>(operationManager.getApp());

  const Wrapper: React.FC<{ id: string }> = useMemo(() => {
    return props => {
      const style =
        props.id === selectedComponentId ? { boxShadow: '0 0 1px red' } : undefined;
      const onClick = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        setSelectedComponentId(() => props.id);
      };
      return (
        <div onClick={onClick} style={style}>
          {props.children}
        </div>
      );
    };
  }, [selectedComponentId]);

  useEffect(() => {
    const onAppChange = (app: Application) => {
      setApp(() => app);
    };
    eventBus.on('appChange', onAppChange);

    return () => {
      eventBus.off('appChange', onAppChange);
    };
  }, []);

  const onClickAdd = useCallback(() => {
    eventBus.send(
      'operation',
      new CreateComponentOperation('root', 'container', 'chakra_ui/v1/input')
    );
  }, [app, setApp]);

  const onClickUndo = useCallback(() => {
    eventBus.send('undo');
  }, [app, setApp]);

  const gridCallbacks: GridCallbacks = {
    onDragStop(id, layout) {
      eventBus.send(
        'operation',
        new ModifyComponentPropertyOperation(id, 'layout', layout)
      );
      console.log('onDragStop', id, layout);
    },
    onDrop(id, layout, item, e) {
      const component = e.dataTransfer?.getData('component') || '';
      const componentId = `component${count++}`;
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
      console.log('onDragStop', id, layout);
      console.log('onDrop', id, layout, item);
    },
  };

  return (
    <Box display="flex" height="100vh" width="100vw">
      <Box flex="1">
        <button onClick={onClickAdd}>添加</button>
        <button onClick={onClickUndo}>撤销</button>
        <StructureTree app={app} onSelectComponent={id => setSelectedComponentId(id)} />
      </Box>
      <Box flex="1">
        <ComponentList />
      </Box>
      <Box flex="3" borderRight="2px solid black">
        <App
          options={app}
          debugEvent={false}
          debugStore={false}
          gridCallbacks={gridCallbacks}
        />
      </Box>
      <Box flex="1" borderRight="2px solid black">
        <ComponentForm app={app} selectedId={selectedComponentId} />
      </Box>
    </Box>
  );
};
