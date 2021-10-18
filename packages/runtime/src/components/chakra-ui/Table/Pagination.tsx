import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, IconButton } from '@chakra-ui/react';

type TablePaginationProps = {
  pageNumber: number;
  currentPage: number; // start from 0
  onChange: (nextPage: number) => void;
};

export const TablePagination: React.FC<TablePaginationProps> = props => {
  const { pageNumber, currentPage, onChange } = props;

  const pageEles = Array(pageNumber)
    .fill(1)
    .map((_, i) => {
      const onClick = () => onChange(i);
      return (
        <Button key={i} margin="1" disabled={currentPage === i} onClick={onClick}>
          {i + 1}
        </Button>
      );
    });

  return (
    <Box margin="4">
      <IconButton
        aria-label="prev"
        icon={<ChevronLeftIcon />}
        disabled={currentPage === 0}
        onClick={() => onChange(Math.max(0, currentPage - 1))}
      />
      {pageEles}
      <IconButton
        aria-label="next"
        icon={<ChevronRightIcon />}
        disabled={currentPage === pageNumber - 1}
        onClick={() => onChange(Math.min(pageNumber - 1, currentPage + 1))}
      />
    </Box>
  );
};
