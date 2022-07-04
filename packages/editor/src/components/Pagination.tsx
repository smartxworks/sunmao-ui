import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, HStack, IconButton } from '@chakra-ui/react';
import React from 'react';

type Props = {
  currentPage: number;
  lastPage: number;
  handlePageClick: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({
  currentPage,
  lastPage,
  handlePageClick,
}) => {
  const render = [];
  if (currentPage - 1 >= 0) {
    const prevPage = currentPage - 1;
    render.push(
      <IconButton
        size="xs"
        aria-label="left"
        icon={<ChevronLeftIcon />}
        value={prevPage}
        onClick={() => handlePageClick(prevPage)}
        key={`prev-page-${prevPage}`}
      />
    );
  }

  let startIdx;
  let endIdx;
  if (currentPage - 1 >= 0) {
    startIdx = currentPage - 1;
    endIdx = startIdx + 5;
  } else {
    startIdx = 0;
    endIdx = 5;
  }
  if (currentPage + 3 >= lastPage) {
    startIdx = lastPage - 5;
    endIdx = lastPage;
  }

  for (let idx = startIdx; idx < endIdx; idx++) {
    const offset = idx + 1;
    render.push(
      <Button
        size="xs"
        key={`page-${offset}`}
        onClick={() => handlePageClick(idx)}
        value={idx}
        color={idx === currentPage ? 'blue.200' : undefined}
      >
        {offset}
      </Button>
    );
  }

  if (endIdx < lastPage) {
    const offset = lastPage - 1;
    render.push(
      <React.Fragment key={`last-page-${lastPage}`}>
        <Button size="xs" value={offset}>
          ...
        </Button>
        <Button size="xs" onClick={() => handlePageClick(lastPage)} value={offset}>
          {lastPage}
        </Button>
      </React.Fragment>
    );
  }

  if (currentPage + 1 < lastPage) {
    const nextPage = currentPage + 1;
    render.push(
      <IconButton
        size="xs"
        aria-label="right"
        icon={<ChevronRightIcon />}
        value={nextPage}
        onClick={() => handlePageClick(nextPage)}
        key={`next-page-${nextPage}`}
      />
    );
  }
  return <HStack>{render}</HStack>;
};
