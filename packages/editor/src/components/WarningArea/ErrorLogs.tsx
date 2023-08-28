import { Props } from './type';
import React from 'react';
import { DebugTable } from './Table';
import { Box } from '@chakra-ui/react';

export const ErrorLogs: React.FC<Props> = ({ services }) => {
  const { setSelectedComponentId } = services.editorStore;
  const errorColumns = [
    {
      title: 'Component Id',
      dataIndex: 'componentId',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => setSelectedComponentId(item.componentId)}
          >
            {item.componentId}
          </Box>
        );
      },
    },
    {
      title: 'Trait Type',
      dataIndex: 'traitType',
    },
    {
      title: 'Property',
      dataIndex: 'property',
    },
    {
      title: 'Message',
      dataIndex: 'message',
    },
  ];

  return (
    <DebugTable
      data={[]}
      pagination={{ hideOnSinglePage: true }}
      columns={errorColumns}
      emptyMessage="No Errors"
    />
  );
};
