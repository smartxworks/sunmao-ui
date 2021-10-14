import { DeleteIcon } from '@chakra-ui/icons';
import { HStack, IconButton, Text } from '@chakra-ui/react';

type Props = {
  title: string;
  isSelected: boolean;
  onClick: () => void;
  onClickRemove: () => void;
};

export const ComponentItemView: React.FC<Props> = props => {
  const { title, isSelected, onClick, onClickRemove } = props;
  return (
    <HStack width="full" justify="space-between">
      <Text color={isSelected ? 'red.500' : 'black'} onClick={onClick}>
        {title}
      </Text>
      <IconButton
        variant="ghost"
        size="sm"
        aria-label="remove"
        icon={<DeleteIcon />}
        onClick={onClickRemove}
      />
    </HStack>
  );
};
