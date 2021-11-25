import { Divider, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { RuntimeModuleSpec } from '../../../../core/lib';
import { getDefaultAppFromLS } from '../../operations/useAppModel';

export function getModulesFromLS() {
  try {
    const modulesFromLS = localStorage.getItem('modules');
    if (modulesFromLS) {
      return JSON.parse(modulesFromLS);
    }
    return [];
  } catch (error) {
    return [];
  }
}

export const Explorer: React.FC = () => {
  const app = getDefaultAppFromLS();
  const appItemId = `app_${app.metadata.name}`;
  const [selectedItem, setSelectedItem] = React.useState<string | undefined>(appItemId);

  const onClick = (id: string) => {
    setSelectedItem(id);
  };
  const appItem = (
    <ExplorerItem
      key={app.metadata.name}
      id={appItemId}
      title={app.metadata.name}
      onClick={onClick}
      isActive={selectedItem === appItemId}
    />
  );

  const modules: RuntimeModuleSpec[] = getModulesFromLS()
  const moduleItems = modules.map((module: RuntimeModuleSpec) => {
    const onClick = (id: string) => {
      setSelectedItem(id);
    };
    const itemId = `module_${module.metadata.name}`;
    return (
      <ExplorerItem
        key={module.metadata.name}
        id={itemId}
        title={module.metadata.name}
        onClick={onClick}
        isActive={selectedItem === itemId}
      />
    );
  });

  return (
    <VStack alignItems="start">
      <Text fontSize="lg" fontWeight="bold">
        Applications
      </Text>
      {appItem}
      <Divider />
      <Text fontSize="lg" fontWeight="bold">Modules</Text>
      {moduleItems}
    </VStack>
  );
};

type ExplorerItemProps = {
  id: string;
  title: string;
  isActive: boolean;
  onClick: (id: string) => void;
};

const ExplorerItem: React.FC<ExplorerItemProps> = ({ id, title, isActive, onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isActive ? '#eee' : '#fff',
        width: '100%',
      }}
    >
      {title}
    </div>
  );
};
