import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

export const PreviewModal: React.FC<{ onClose: () => void }> = ({
  onClose,
  children,
}) => {
  return (
    <Modal onClose={onClose} size="full" isOpen>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Preview App</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
