import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { EditorServices } from '../../types';
import { ExtractModuleView } from './ExtractModuleView';

type Props = {
  componentId: string;
  onClose: () => void;
  services: EditorServices;
};

export const ExtractModuleModal: React.FC<Props> = ({
  componentId,
  onClose,
  services,
}) => {
  return (
    <Modal onClose={onClose} isOpen>
      <ModalOverlay />
      <ModalContent maxWidth="60vw">
        <ModalHeader>Relationships of {componentId}</ModalHeader>
        <ModalCloseButton />
        <ModalBody flex="1 1 auto" height="75vh" alignItems="start" overflow="auto">
          <ExtractModuleView componentId={componentId} services={services} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
