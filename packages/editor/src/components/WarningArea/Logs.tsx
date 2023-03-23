import { Props, DisplayedLog } from './type';
import React from 'react';
import { DebugTable } from './Table';
import { Box, Button, Tooltip } from '@chakra-ui/react';
import { css } from '@emotion/css';
import { ExplorerMenuTabs } from '../../constants/enum';
import { MERGE_STATE, MODULE_EVENT, TRIGGER_EVENT } from './const';

type LogsProps = Props & {
  logs: DisplayedLog[];
  setLogs: React.Dispatch<React.SetStateAction<DisplayedLog[]>>;
  count?: number;
};

export const Logs: React.FC<LogsProps> = ({ services, logs, setLogs, count = 5 }) => {
  const { setSelectedComponentId, setExplorerMenuTab, setViewStateComponentId } =
    services.editorStore;

  const eventColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
    },
    {
      title: 'Event',
      dataIndex: 'eventType',
    },
    {
      title: 'Target',
      dataIndex: 'target',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => {
              switch (item.type) {
                case MERGE_STATE:
                  setExplorerMenuTab(ExplorerMenuTabs.STATE);
                  setViewStateComponentId(item.target);
                  break;
                case MODULE_EVENT:
                case TRIGGER_EVENT:
                default:
                  setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
                  setSelectedComponentId(item.target);
                  break;
              }
            }}
          >
            {item.target}
          </Box>
        );
      },
    },
    {
      title: 'Parameters',
      dataIndex: 'parameters',
      render: (_col: any, item: any) => {
        const parameters = JSON.stringify(item.parameters);
        return (
          <Tooltip label={parameters}>
            <div
              className={css`
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              `}
            >
              {parameters}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Method',
      dataIndex: 'methodName',
    },
    {
      title: 'TriggerId',
      dataIndex: 'triggerId',
      render: (_col: any, item: any) => {
        return (
          <Box
            cursor="pointer"
            fontWeight="bold"
            onClick={() => {
              setExplorerMenuTab(ExplorerMenuTabs.UI_TREE);
              setSelectedComponentId(item.triggerId);
            }}
          >
            {item.triggerId}
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <DebugTable
        className={css`
          table-layout: fixed;
          tbody td {
            height: 40px;
          }
        `}
        columns={eventColumns}
        data={logs}
        pagination={{ hideOnSinglePage: true, pageSize: count }}
        emptyMessage="No Logs"
        footer={
          !!logs.length && (
            <Button
              onClick={() => {
                setLogs([]);
              }}
              size="sm"
            >
              clear
            </Button>
          )
        }
      />
    </Box>
  );
};
