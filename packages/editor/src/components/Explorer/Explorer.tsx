import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { ExplorerForm } from './ExplorerForm/ExplorerForm';
import { ExplorerTree } from './ExplorerTree';
import { EditorServices } from '../../types';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

type Props = {
  services: EditorServices;
};

export const Explorer: React.FC<Props> = ({ services }) => {
  const [isEditingMode, setIsEditingMode] = React.useState(false);
  const [formType, setFormType] = React.useState<'app' | 'module'>('app');
  const [currentVersion, setCurrentVersion] = React.useState<string>('');
  const [currentName, setCurrentName] = React.useState<string>('');
  const onEdit = (type: 'app' | 'module', version: string, name: string) => {
    setFormType(type);
    setCurrentVersion(version);
    setCurrentName(name);
    setIsEditingMode(true);
  };

  return (
    <ErrorBoundary>
      <Box padding={4}>
        <ExplorerTree onEdit={onEdit} services={services} />
        <Modal
          onClose={() => {
            setIsEditingMode(false);
          }}
          closeOnOverlayClick
          isOpen={isEditingMode}
        >
          <ModalOverlay />
          <ModalContent p="10px" maxW="800px">
            <ModalCloseButton />
            <ModalHeader> {formType === 'app' ? 'Application' : 'Module'}</ModalHeader>
            <ModalBody
              w="full"
              flex="1 1 auto"
              height="75vh"
              alignItems="start"
              overflow="auto"
            >
              <ExplorerForm
                formType={formType}
                version={currentVersion}
                name={currentName}
                setCurrentVersion={setCurrentVersion}
                setCurrentName={setCurrentName}
                services={services}
                onClose={() => setIsEditingMode(false)}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </ErrorBoundary>
  );
};
