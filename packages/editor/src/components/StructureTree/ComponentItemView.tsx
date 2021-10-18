import { ChevronDownIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';

type Props = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onClickRemove?: () => void;
  noChevron: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
  isDroppable?: boolean;
};

export const ComponentItemView: React.FC<Props> = props => {
  const {
    title,
    isSelected,
    noChevron,
    isExpanded,
    onClick,
    onToggleExpanded,
    onClickRemove,
    isDroppable,
  } = props;

  const [isDragOver, setIsDragOver] = useState(false);

  const expandIcon = (
    <IconButton
      position="absolute"
      left="-5"
      aria-label="showChildren"
      size="xs"
      variant="unstyled"
      onClick={onToggleExpanded}
      _focus={{
        outline: '0',
      }}
      icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    />
  );

  const onDragOver = () => {
    if (isDroppable) {
      setIsDragOver(true);
    }
  };
  return (
    <Box
      width="full"
      onDragOver={onDragOver}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => setIsDragOver(false)}
      background={isDragOver ? 'gray.100' : undefined}
    >
      {noChevron ? null : expandIcon}
      <HStack width="full" justify="space-between">
        <Text color={isSelected ? 'red.500' : 'black'} onClick={onClick} cursor="pointer">
          {title}
        </Text>
        {onClickRemove ? (
          <IconButton
            variant="ghost"
            size="smx"
            aria-label="remove"
            icon={<DeleteIcon />}
            onClick={onClickRemove}
          />
        ) : null}
      </HStack>
    </Box>
  );
};
