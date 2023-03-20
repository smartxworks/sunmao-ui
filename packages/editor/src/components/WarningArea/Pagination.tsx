import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, HStack, IconButton } from '@chakra-ui/react';
import React from 'react';

type Props = {
  currentPage: number;
  lastPage: number;
  hideOnSinglePage?: boolean;
  handlePageClick: (page: number) => void;
};

export const Pagination: React.FC<Props> = ({
  currentPage,
  lastPage,
  handlePageClick,
  hideOnSinglePage = false,
}) => {
  if (lastPage === 1 && hideOnSinglePage) {
    return null;
  }

  const pages = [];
  if (currentPage - 1 >= 0) {
    const prevPage = currentPage - 1;
    pages.push(
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
  const ShowPagesNumber = 5;
  let startIdx;
  let endIdx;
  if (currentPage - 1 >= 0) {
    startIdx = currentPage - 1;
    endIdx = startIdx + ShowPagesNumber;
  } else {
    startIdx = 0;
    endIdx = ShowPagesNumber;
  }
  if (currentPage + 4 >= lastPage) {
    startIdx = Math.max(0, lastPage - ShowPagesNumber);
    endIdx = lastPage;
  }

  for (let idx = startIdx; idx < endIdx; idx++) {
    const offset = idx + 1;
    pages.push(
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
    pages.push(
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
    pages.push(
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
  return <HStack>{pages}</HStack>;
};
