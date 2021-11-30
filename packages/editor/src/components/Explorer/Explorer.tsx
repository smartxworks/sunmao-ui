import { Divider, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import { editorStore } from '../../EditorStore';

export const Explorer: React.FC = observer(() => {
  const { app, modules, updateCurrentEditingTarget } = editorStore;
  const appItemId = `app_${app.metadata.name}`;
  const [selectedItem, setSelectedItem] = React.useState<string | undefined>(appItemId);

  const onClickApp = (id: string) => {
    setSelectedItem(id);
    updateCurrentEditingTarget('app', app.metadata.name);
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

  console.log('modules', modules);
  const moduleItems = modules.map((module: ImplementedRuntimeModule) => {
    const moduleItemId = `module_${module.metadata.name}`;
    const onClickModule = (id: string) => {
      setSelectedItem(id);
      updateCurrentEditingTarget('module', module.metadata.name);
    };
    const onRemove = () => {
      editorStore.appStorage.removeModule(module.version, module.metadata.name);
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
          onClick={() => editorStore.appStorage.createModule()}
        />
      </HStack>
      {moduleItems}
    </VStack>
  );
});

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
