import React, { useCallback, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react';

export type OpenOptions = {
  title?: string;
  message?: string;
};

function useModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [options, setOptions] = useState<Partial<OpenOptions>>({});
  const { title, message } = options;
  const open = useCallback(
    (options: OpenOptions) => {
      setOptions(options);
      onOpen();
    },
    [onOpen]
  );

  const modal = (
    <Modal onClose={onClose} size="md" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        {title ? <ModalHeader>{title}</ModalHeader> : null}
        <ModalCloseButton />
        <ModalBody>{message}</ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return {
    modal,
    open,
    close: onClose,
  };
}

export default useModal;
