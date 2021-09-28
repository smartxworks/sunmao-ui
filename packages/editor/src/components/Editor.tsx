import { useCallback, useEffect, useMemo, useState } from 'react';
import { Application } from '@meta-ui/core';
import { Box } from '@chakra-ui/react';
import { DialogFormSchema } from '../constants';
import { App } from '../metaUI';
import { StructureTree } from './StructureTree';
import { OperationManager } from '../operations/OperationManager';
import { CreateComponentOperation } from '../operations/Operations';
import { eventBus } from '../eventBus';

const operationManager = new OperationManager(DialogFormSchema);

export const Editor = () => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [app, setApp] = useState<Application>(operationManager.getApp());

  const Wrapper: React.FC<{ id: string }> = useMemo(() => {
    return props => {
      if (props.id === selectedComponent) {
        return <div style={{ boxShadow: '0 0 1px red' }}>{props.children}</div>;
      }
      return <>{props.children}</>;
    };
  }, [selectedComponent]);

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
      new CreateComponentOperation('root', 'root', 'chakra_ui/v1/input')
    );
  }, [app, setApp]);

  const onClickUndo = useCallback(() => {
    eventBus.send('undo');
  }, [app, setApp]);

  return (
    <Box display="flex" height="100vh">
      <button onClick={onClickAdd}>添加</button>
      <button onClick={onClickUndo}>撤销</button>
      <Box flex="1">
        <StructureTree app={app} onSelectComponent={id => setSelectedComponent(id)} />
      </Box>
      <Box flex="3" borderRight="2px solid black">
        <App
          debugStore={false}
          debugEvent={false}
          options={app}
          componentWrapper={Wrapper}
        />
      </Box>
    </Box>
  );
};
