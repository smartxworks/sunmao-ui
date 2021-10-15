import { ChevronDownIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, HStack, IconButton, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onClickRemove: () => void;
  noChevron: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
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
  } = props;

  const expandIcon = (
    <IconButton
      position="absolute"
      left="-5"
      aria-label="showChildren"
      size="xs"
      variant="unstyled"
      onClick={onToggleExpanded}
      icon={isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
    />
  );
  return (
    <Box width="full">
      {noChevron ? null : expandIcon}
      <HStack width="full" justify="space-between">
        <Text color={isSelected ? 'red.500' : 'black'} onClick={onClick}>
          {title}
        </Text>
        <IconButton
          variant="ghost"
          size="smx"
          aria-label="remove"
          icon={<DeleteIcon />}
          onClick={onClickRemove}
        />
      </HStack>
    </Box>
  );
};
