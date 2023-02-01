import React from 'react';
import { Table, Tbody, Td, Th, Thead, Tr, VStack } from '@chakra-ui/react';
import { Pagination } from './Pagination';
import { defaultPageSize } from './const';

type Column = {
  title: string;
  dataIndex: string;
  render?: (col: any, item: any, index: number) => React.ReactElement;
};

type TableProps = {
  columns: Column[];
  pagination?: {
    pageSize?: number;
    lastPage?: number;
    hideOnSinglePage?: boolean;
  };
  data: any[];
};

export const DebugTable: React.FC<TableProps> = ({
  columns = [],
  pagination = {},
  data,
}) => {
  const { pageSize = defaultPageSize, hideOnSinglePage = false, lastPage } = pagination;
  const [currPage, setCurrPage] = React.useState(0);
  const currentData = data.slice(currPage * pageSize, currPage * pageSize + pageSize);

  return (
    <VStack width="full" justifyContent="start">
      <Table size="sm" width="full" maxHeight="200px" overflow="auto">
        <Thead>
          <Tr>
            {columns.map(c => {
              return <Th key={c.title}>{c.title}</Th>;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {currentData.map((d, i) => {
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
          })}
        </Tbody>
      </Table>
      <Pagination
        currentPage={currPage}
        lastPage={lastPage || Math.ceil(data.length / pageSize)}
        handlePageClick={page => setCurrPage(page)}
        hideOnSinglePage={hideOnSinglePage}
      />
    </VStack>
  );
};
