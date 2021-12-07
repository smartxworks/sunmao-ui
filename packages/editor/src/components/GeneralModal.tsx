import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

export const GeneralModal: React.FC<{ onClose: () => void, title: string }> = ({
  title,
  onClose,
  children,
  
}) => {
  return (
    <Modal onClose={onClose} size="full" isOpen>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
