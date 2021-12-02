import { Divider, HStack, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { ImplementedRuntimeModule } from '@sunmao-ui/runtime';
import { editorStore } from '../../EditorStore';

type ExplorerTreeProps = {
  onEdit: (type: 'app' | 'module', version: string, name: string) => void;
};

export const ExplorerTree: React.FC<ExplorerTreeProps> = observer(({ onEdit }) => {
  const { app, modules, updateCurrentEditingTarget } = editorStore;
  const appItemId = `app_${app.metadata.name}`;
  const [selectedItem, setSelectedItem] = React.useState<string | undefined>(appItemId);

  const onClickApp = () => {
    setSelectedItem(appItemId);
    updateCurrentEditingTarget('app', app.version, app.metadata.name);
  };
  const onEditApp = () => {
    onEdit('app', app.version, app.metadata.name);
  };

  const appItem = (
    <ExplorerTreeItem
      key={app.metadata.name}
      title={`${app.version}/${app.metadata.name}`}
      onClick={onClickApp}
      isActive={selectedItem === appItemId}
      onEdit={onEditApp}
    />
  );

  const moduleItems = modules.map((module: ImplementedRuntimeModule) => {
    const moduleItemId = `module_${module.metadata.name}`;
    const onClickModule = () => {
      setSelectedItem(moduleItemId);
      updateCurrentEditingTarget('module', module.version, module.metadata.name);
    };
    const onEditModule = () => {
      onEdit('module', module.version, module.metadata.name);
    };
    const onRemove = () => {
      editorStore.appStorage.removeModule(module.version, module.metadata.name);
    };
    return (
      <ExplorerTreeItem
        key={module.metadata.name}
        title={`${module.version}/${module.metadata.name}`}
        onClick={onClickModule}
        onRemove={onRemove}
        isActive={selectedItem === moduleItemId}
        onEdit={onEditModule}
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

type ExplorerTreeItemProps = {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onRemove?: () => void;
};

const ExplorerTreeItem: React.FC<ExplorerTreeItemProps> = ({
  title,
  isActive,
  onClick,
  onRemove,
  onEdit,
}) => {
  const _onEdit = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onEdit();
  };
  return (
    <HStack
      width="full"
      justify="space-between"
      cursor="pointer"
      borderRadius="5"
      padding="2"
      backgroundColor={isActive ? 'gray.100' : 'white'}
    >
      <Tooltip label={title} openDelay={500}>
        <Text
          fontSize="lg"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          onClick={onClick}
        >
          {title}
        </Text>
      </Tooltip>
      <HStack>
        <IconButton
          variant="ghost"
          size="smx"
          aria-label="edit"
          icon={<EditIcon />}
          onClick={_onEdit}
        />
        {onRemove ? (
          <IconButton
            variant="ghost"
            size="smx"
            aria-label="remove"
            icon={<DeleteIcon />}
            onClick={onRemove}
          />
        ) : null}
      </HStack>
    </HStack>
  );
};
