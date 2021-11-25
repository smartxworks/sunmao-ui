import { Divider, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { RuntimeModuleSpec } from '@sunmao-ui/core';
import { AppStorage } from '../../AppStorage';

type ExplorerProps = {
  appStorage: AppStorage;
};

export const Explorer: React.FC<ExplorerProps> = ({ appStorage }) => {
  const app = appStorage.app;
  const appItemId = `app_${app.metadata.name}`;
  const [selectedItem, setSelectedItem] = React.useState<string | undefined>(appItemId);

  const onClickApp = (id: string) => {
    setSelectedItem(id);
    appStorage.updateCurrentId('app', app.metadata.name);
  };

  const appItem = (
    <ExplorerItem
      key={app.metadata.name}
      id={appItemId}
      title={app.metadata.name}
      onClick={onClickApp}
      isActive={selectedItem === appItemId}
    />
  );

  const modules: RuntimeModuleSpec[] = appStorage.modules
  const moduleItems = modules.map((module: RuntimeModuleSpec) => {
    const moduleItemId = `module_${module.metadata.name}`;
    const onClickModule = (id: string) => {
      setSelectedItem(id);
      appStorage.updateCurrentId('module', module.metadata.name);
    };
    return (
      <ExplorerItem
        key={module.metadata.name}
        id={moduleItemId}
        title={module.metadata.name}
        onClick={onClickModule}
        isActive={selectedItem === moduleItemId}
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
      <Text fontSize="lg" fontWeight="bold">
        Modules
      </Text>
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
