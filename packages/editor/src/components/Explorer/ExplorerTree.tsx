import React from 'react';
import { Divider, HStack, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { AddIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { EditorServices } from '../../types';

type ExplorerTreeProps = {
  onEdit: (kind: 'app' | 'module', version: string, name: string) => void;
  services: EditorServices;
};

function genItemId(kind: 'app' | 'module', version: string, name: string) {
  return `${kind}-${version}-${name}`;
}

export const ExplorerTree: React.FC<ExplorerTreeProps> = observer(
  ({ onEdit, services }) => {
    const { editorStore } = services;
    const { app, modules, currentEditingTarget, updateCurrentEditingTarget } =
      editorStore;
    const appItemId = genItemId('app', app.version, app.metadata.name);
    const [selectedItem, setSelectedItem] = React.useState<string | undefined>(
      genItemId(
        currentEditingTarget.kind,
        currentEditingTarget.version,
        currentEditingTarget.name
      )
    );

    const onClickApp = () => {
      setSelectedItem(appItemId);
      updateCurrentEditingTarget('app', app.version, app.metadata.name);
    };
    const onEditApp = () => {
      onEdit('app', app.version, app.metadata.name);
    };

    const appEditable =
      currentEditingTarget.kind === 'app' &&
      currentEditingTarget.name === app.metadata.name &&
      currentEditingTarget.version === app.version;

    const appItem = (
      <ExplorerTreeItem
        key={app.metadata.name}
        title={`${app.version}/${app.metadata.name}`}
        onClick={onClickApp}
        isActive={selectedItem === appItemId}
        onEdit={onEditApp}
        editable={appEditable}
      />
    );

    const moduleItems = modules.map(module => {
      const moduleItemId = genItemId('module', module.version, module.metadata.name);
      const onClickModule = () => {
        setSelectedItem(moduleItemId);
        updateCurrentEditingTarget(
          'module',
          module.version,
          module.metadata.name,
          module.spec,
          module.metadata
        );
      };
      const onEditModule = () => {
        onEdit('module', module.version, module.metadata.name);
      };
      const onRemove = () => {
        editorStore.appStorage.removeModule(module.version, module.metadata.name);
      };
      const editable =
        currentEditingTarget.kind === 'module' &&
        currentEditingTarget.name === module.metadata.name &&
        currentEditingTarget.version === module.version;
      return (
        <ExplorerTreeItem
          key={module.metadata.name}
          title={`${module.version}/${module.metadata.name}`}
          onClick={onClickModule}
          onRemove={onRemove}
          isActive={selectedItem === moduleItemId}
          onEdit={onEditModule}
          editable={editable}
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
            onClick={() => editorStore.appStorage.createModule({})}
          />
        </HStack>
        {moduleItems}
      </VStack>
    );
  }
);

type ExplorerTreeItemProps = {
  title: string;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  editable: boolean;
  onRemove?: () => void;
};

const ExplorerTreeItem: React.FC<ExplorerTreeItemProps> = ({
  title,
  isActive,
  onClick,
  onRemove,
  onEdit,
  editable,
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
        {editable ? (
          <IconButton
            variant="ghost"
            size="smx"
            aria-label="edit"
            icon={<EditIcon />}
            onClick={_onEdit}
          />
        ) : null}
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
