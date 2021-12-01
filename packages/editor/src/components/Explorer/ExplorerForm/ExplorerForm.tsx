import React from 'react';
import { observer } from 'mobx-react-lite';
import { IconButton, VStack } from '@chakra-ui/react';
import { ArrowLeftIcon } from '@chakra-ui/icons';
type Props = {
  formType: 'app' | 'module';
  version: string;
  name: string;
  onBack: () => void;
};

export const ExplorerForm: React.FC<Props> = observer(
  ({ formType, version, name, onBack }) => {
    let form;
    switch (formType) {
      case 'app':
        form = (
          <span>
            App Form: {version}/{name}
          </span>
        );
        break;
      case 'module':
        form = (
          <span>
            module Form: {version}/{name}
          </span>
        );
        break;
    }
    return (
      <VStack alignItems='start'>
        <IconButton
          aria-label="go back to tree"
          size="xs"
          icon={<ArrowLeftIcon />}
          variant="ghost"
          onClick={onBack}
        />
        {form}
      </VStack>
    );
  }
);
