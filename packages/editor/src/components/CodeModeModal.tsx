import React, { useState, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { genOperation } from '../operations';
import { AppModel } from '../AppModel/AppModel';
import { SchemaEditor } from './CodeEditor';
import { EditorServices } from '../types';
import { Application } from '@sunmao-ui/core';

type Props = {
  app: Application;
  onClose: () => void;
  services: EditorServices;
};

export const CodeModeModal: React.FC<Props> = observer(({ app, onClose, services }) => {
  const { registry, eventBus } = services;
  const [code, setCode] = useState('');

  const onSave = useCallback(() => {
    onClose();
    if (code) {
      eventBus.send(
        'operation',
        genOperation(registry, 'replaceApp', {
          app: new AppModel(JSON.parse(code).spec.components, registry),
        })
      );
    }
  }, [code, eventBus, onClose, registry]);

  return (
    <Modal isOpen size="6xl" onClose={onClose}>
      <ModalOverlay />
      <ModalContent width="800px">
        <ModalHeader>Code Mode</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box overflow="auto" minHeight="600px" maxHeight="1000px">
            <SchemaEditor defaultCode={JSON.stringify(app, null, 2)} onChange={setCode} />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={() => onClose()}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={onSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});
