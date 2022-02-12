import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';

export const GeneralModal: React.FC<{
  onClose: () => void;
  title: string;
  size?: string;
}> = ({ title, onClose, size = 'full', children }) => {
  return (
    <Modal onClose={onClose} size={size} isOpen>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
