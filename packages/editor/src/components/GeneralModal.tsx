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
  scrollBehavior?: 'inside' | 'outside';
}> = ({ title, onClose, size = 'full', children, scrollBehavior = 'inside' }) => {
  return (
    <Modal onClose={onClose} scrollBehavior={scrollBehavior} size={size} isOpen>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
