import { Box } from '@chakra-ui/react';

type Props = {
  onCreateComponent: (componentType: string) => void;
  onMoveComponent: (from: string) => void;
  droppable?: boolean;
};

export const DropComponentWrapper: React.FC<Props> = props => {
  const {
    onCreateComponent,
    onMoveComponent,
    droppable = true
  } = props;

  const onDragOver = (e: React.DragEvent) => {
    if (droppable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const creatingComponent = e.dataTransfer?.getData('component') || '';
    const movingComponent = e.dataTransfer?.getData('moveComponent') || '';

    if (movingComponent) {
      onMoveComponent(movingComponent);
    }

    if (creatingComponent) {
      onCreateComponent(creatingComponent);
    }
  };
  return (
    <Box width="full" onDrop={onDrop} onDragOver={onDragOver}>
      {props.children}
    </Box>
  );
};
