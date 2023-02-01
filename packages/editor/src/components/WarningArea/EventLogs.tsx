import { Props, EventLog } from './type';
import React from 'react';
import { DebugTable } from './Table';
import { Box } from '@chakra-ui/react';

type EventLogsProps = Props & {
  events: EventLog[];
};

export const EventLogs: React.FC<EventLogsProps> = ({ services, events }) => {
  const { setSelectedComponentId } = services.editorStore;

  const eventColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
    },
    {
      title: 'Target',
      dataIndex: 'target',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => setSelectedComponentId(item.target)}
          >
            {item.target}
          </Box>
        );
      },
    },
    {
      title: 'Method',
      dataIndex: 'methodName',
    },
    {
      title: 'Triggered',
      dataIndex: 'triggered',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => setSelectedComponentId(item.triggered)}
          >
            {item.triggered}
          </Box>
        );
      },
    },
  ];

  return (
    <DebugTable
      columns={eventColumns}
      data={events}
      pagination={{ hideOnSinglePage: true }}
    />
  );
};
