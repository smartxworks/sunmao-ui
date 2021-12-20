import { Box } from '@chakra-ui/react';

type Props = {
  onCreateComponent: (componentType: string) => void;
  onMoveComponent: (from: string) => void;
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
    const movingComponent = e.dataTransfer?.getData('moveComponent') || '';

    if (movingComponent) {
      props.onMoveComponent(movingComponent)
    }

    if (creatingComponent) {
      props.onCreateComponent(creatingComponent);
    }
  };
  return (
    <Box width="full" onDrop={onDrop} onDragOver={onDragOver}>
      {props.children}
    </Box>
  );
};
