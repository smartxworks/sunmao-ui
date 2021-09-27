import { useCallback, useMemo, useState } from 'react';
import { Application } from '@meta-ui/core';
import { Box } from '@chakra-ui/react';
import { DialogFormSchema } from '../constants';
import { App } from '../metaUI';
import { StructureTree } from './StructureTree';
import { OperationManager } from '../operations/OperationManager';
import { CreateComponentOperation } from '../operations/Operations';

const operationManager = new OperationManager(DialogFormSchema);

export const Editor = () => {
  const [selectedComponent, setSelectedComponent] = useState('');
  const [app, setApp] = useState<Application>(DialogFormSchema);

  const Wrapper: React.FC<{ id: string }> = useMemo(() => {
    return props => {
      if (props.id === selectedComponent) {
        return <div style={{ boxShadow: '0 0 1px red' }}>{props.children}</div>;
      }
      return <>{props.children}</>;
    };
  }, [selectedComponent]);

  const addComponent = useCallback(() => {
    const newApp = operationManager.apply(
      new CreateComponentOperation('root', 'root', 'chakra_ui/v1/input')
    );

    setApp(newApp!);
  }, [app, setApp]);

  const onClickUndo = useCallback(() => {
    const newApp = operationManager.undo();
    setApp(newApp!);
  }, [app, setApp]);

  return (
    <Box display="flex" height="100vh">
      <button onClick={addComponent}>添加</button>
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
