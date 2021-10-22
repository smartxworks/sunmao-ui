import { Box } from '@chakra-ui/react';

type Props = {
  onDrop: (componentType: string) => void;
};

export const DropComponentWrapper: React.FC<Props> = props => {
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const creatingComponent = e.dataTransfer?.getData('component') || '';

    props.onDrop(creatingComponent);
  };
  return (
    <Box width="full" onDrop={onDrop} onDragOver={onDragOver}>
      {props.children}
    </Box>
  );
};
