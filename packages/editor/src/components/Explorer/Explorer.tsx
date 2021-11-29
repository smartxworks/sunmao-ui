import { Divider, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { AppStorage } from '../../AppStorage';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { eventBus } from '../../eventBus';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';

type ExplorerProps = {
  appStorage: AppStorage;
};

const useAppStorage = (appStorage: AppStorage) => {
  const [modules, setModules] = React.useState<ImplementedRuntimeModule[]>(
    appStorage.modules
  );

  eventBus.on('modulesChange', newModules => {
    setModules(newModules);
  });

  return {
    modules,
  };
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

  const { modules } = useAppStorage(appStorage);
  const moduleItems = modules.map((module: ImplementedRuntimeModule) => {
    const moduleItemId = `module_${module.metadata.name}`;
    const onClickModule = (id: string) => {
      setSelectedItem(id);
      appStorage.updateCurrentId('module', module.metadata.name);
    };
    const onRemove = () => {
      appStorage.removeModule(module);
    };
    return (
      <ExplorerItem
        key={module.metadata.name}
        id={moduleItemId}
        title={`${module.version}/${module.metadata.name}`}
        onClick={onClickModule}
        onRemove={onRemove}
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
      <HStack width="full" justifyContent="space-between">
        <Text fontSize="lg" fontWeight="bold">
          Modules
        </Text>
        <IconButton
          aria-label="create module"
          size="xs"
          icon={<AddIcon />}
          onClick={() => appStorage.createModule()}
        />
      </HStack>
      {moduleItems}
    </VStack>
  );
};

type ExplorerItemProps = {
  id: string;
  title: string;
  isActive: boolean;
  onClick: (id: string) => void;
  onRemove?: () => void;
};

const ExplorerItem: React.FC<ExplorerItemProps> = ({
  id,
  title,
  isActive,
  onClick,
  onRemove,
}) => {
  return (
    <HStack
      width="full"
      justify="space-between"
      cursor="pointer"
      borderRadius="5"
      padding="2"
      backgroundColor={isActive ? 'gray.100' : 'white'}
    >
      <Text fontSize="lg" onClick={() => onClick(id)}>
        {title}
      </Text>
      {onRemove ? (
        <IconButton
          variant="ghost"
          size="smx"
          aria-label="remove"
          icon={<DeleteIcon />}
          onClick={() => onRemove()}
        />
      ) : null}
    </HStack>
  );
};
