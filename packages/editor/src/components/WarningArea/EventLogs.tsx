import { Props, EventLog } from './type';
import React from 'react';
import { DebugTable } from './Table';
import { Box, Button, Tooltip } from '@chakra-ui/react';
import { css } from '@emotion/css';

type EventLogsProps = Props & {
  events: EventLog[];
  setEventLogs: React.Dispatch<React.SetStateAction<EventLog[]>>;
};

export const EventLogs: React.FC<EventLogsProps> = ({
  services,
  events,
  setEventLogs,
}) => {
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
      title: 'Parameters',
      dataIndex: 'parameters',
      render: (_col: any, item: any) => {
        const parameters = JSON.stringify(item.parameters || '');
        return (
          <Tooltip label={parameters}>
            <span>{parameters.length > 16 ? '...' : parameters}</span>
          </Tooltip>
        );
      },
    },
    {
      title: 'TriggerId',
      dataIndex: 'triggerId',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => setSelectedComponentId(item.triggerId)}
          >
            {item.triggerId}
          </Box>
        );
      },
    },
  ];

  return (
    <DebugTable
      className={css`
        table-layout: fixed;
      `}
      columns={eventColumns}
      data={events}
      pagination={{ hideOnSinglePage: true }}
      emptyMessage="No Event Logs"
      footer={
        !!events.length && (
          <Button
            onClick={() => {
              setEventLogs([]);
            }}
            size="sm"
          >
            clear
          </Button>
        )
      }
    />
  );
};
