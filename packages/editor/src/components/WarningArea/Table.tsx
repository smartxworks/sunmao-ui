import React, { ReactNode, useEffect } from 'react';
import { Box, HStack, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { Pagination } from './Pagination';
import { defaultPageSize, paginationHeight } from './const';

type Column = {
  title: string;
  dataIndex: string;
  render?: (col: any, item: any, index: number) => React.ReactElement;
};

type TableProps = {
  className?: string;
  columns: Column[];
  pagination?: {
    pageSize?: number;
    lastPage?: number;
    hideOnSinglePage?: boolean;
  };
  data: any[];
  footer?: ReactNode;
  emptyMessage?: string;
};

export const DebugTable: React.FC<TableProps> = ({
  columns = [],
  pagination = {},
  data,
  footer,
  emptyMessage = 'No Data',
  className,
}) => {
  const { pageSize = defaultPageSize, hideOnSinglePage = false, lastPage } = pagination;
  const [currPage, setCurrPage] = React.useState(0);
  const currentData = data.slice(currPage * pageSize, currPage * pageSize + pageSize);

  useEffect(() => {
    if (data.length <= Number(pageSize) * (currPage - 1)) {
      setCurrPage(0);
    }
  }, [currPage, data.length, pageSize]);

  return (
    <>
      <Table
        className={className}
        size="sm"
        width="full"
        maxHeight="200px"
        overflow="auto"
      >
        <Thead>
          <Tr>
            {columns.map(c => {
              return <Th key={c.title + c.dataIndex}>{c.title}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {!data.length ? (
            <Tr>
              <Td colSpan={columns.length}>
                <Box textAlign="center">{emptyMessage}</Box>
              </Td>
            </Tr>
          ) : (
            currentData.map((d, i) => {
              return (
                <Tr key={i}>
                  {columns.map(c => {
                    if (c.render) {
                      return <Td key={c.dataIndex}>{c.render(c, d, i)}</Td>;
                    }
                    return <Td key={c.dataIndex}>{d[c.dataIndex]}</Td>;
                  })}
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
      <HStack w="full" h={paginationHeight + 'px'}>
        <Box flex="1">{footer}</Box>
        <Pagination
          currentPage={currPage}
          lastPage={lastPage || Math.ceil(data.length / pageSize)}
          handlePageClick={page => setCurrPage(page)}
          hideOnSinglePage={hideOnSinglePage}
        />
      </HStack>
    </>
  );
};
