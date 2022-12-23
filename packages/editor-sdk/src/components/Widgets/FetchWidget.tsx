import React, { useState } from 'react';
import { WidgetProps } from '../../types/widget';
import { implementWidget } from '../../utils/widget';
import { CORE_VERSION } from '@sunmao-ui/shared';
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from '@chakra-ui/react';
import { ApiForm } from '../ApiForm';

type FetchWidgetType = `${typeof CORE_VERSION}/fetch`;

declare module '../../types/widget' {
  interface WidgetOptionsMap {
    'core/v1/fetch': {};
  }
}

export const FetchWidget: React.FC<WidgetProps<FetchWidgetType>> = props => {
  const { value, onChange, component, services } = props;
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Edit In Modal</Button>
      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen}>
        <ModalContent height="75vh" minWidth="75vw">
          <ModalCloseButton />
          <ModalBody>
            <ApiForm
              value={value}
              onChange={onChange}
              component={component}
              services={services}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default implementWidget<FetchWidgetType>({
  version: CORE_VERSION,
  metadata: {
    name: 'fetch',
  },
})(FetchWidget);
